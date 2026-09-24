# Estudo: Mensageria (Kafka e RabbitMQ) e Redis no ServiceControl

Documento de **estudo** — ideias levantadas em 2026-09 para análise futura. Não é decisão de arquitetura; nenhuma destas ideias está implementada.

## 1. Redis — ideias de uso

Banco em memória. O Postgres continua sendo a **fonte de verdade**; o Redis serve para velocidade, contagem, sessão e sincronização.

| Uso | Exemplo no projeto |
|---|---|
| **Cache de leitura** | Listagens de cadastros (empresas, filiais, cargos, funcionários, equipes) e "serviços da minha equipe hoje" no app — com TTL curto |
| **Refresh token / revogação JWT** | Guardar refresh token com TTL (`SET ... EX`) e blacklist de tokens no logout (`logout` → chave até expirar) |
| **Rate limit de login** | Contador por IP/e-mail (anti brute force) com expiração automática |
| **Locks distribuídos** | Anti-corrida: **1 turno por equipe/dia**, **funcionário em apenas 1 turno aberto**, evitar **duplo finalizar** de serviço (app em 2 devices) |
| **Numeração sequencial da OS** (`OS-0001`) | `INCR` atômico com chave por empresa — evita corrida de sequência no Postgres |
| **GEO (abração de turno)** | Validar raio da filial no check-in: `GEOADD` das filiais + `GEOSEARCH` do GPS do funcionário (Fase 4) |
| **Indicadores em tempo real** | Sorted Sets/contadores: serviços concluídos hoje por equipe (`INCR`), ranking — pré-preenche os relatórios da Fase 5 |
| **Estado do checklist em execução** | Contador de fotos enviadas vs `foto_min`/`foto_max` do tipo de serviço, durante o envio (sem gravar a cada evento) |
| **Pub/Sub** | Invalidação de cache quando um cadastro muda; avisar o Web/app em tempo real (SSE/WebSocket) |

Regras de uso:
- Tudo com **TTL**; nunca usar como persistência definitiva.
- Cache de leitura com invalidação por **pub/sub** (cache stampede evitado).
- Compose: adicionar serviço `redis` (porta 6379) + client `ioredis` (ou cache-manager) no NestJS.

## 2. Mensageria com Kafka — ideias de uso

Kafka é um **event log** distribuído: durabilidade, replay de eventos, múltiplos consumidores independentes e **particionamento** (ordenação garantida por partição). Faz sentido principalmente para o **histórico de execução** e para derivar estados/indicadores sem consultas pesadas sob demanda.

### Topics sugeridos

| Topic | Produtor | Consumidores | O que deriva |
|---|---|---|---|
| `servico.eventos` | App (via API) em cada ação do `ServicoEvento` (iniciar/pausar/retomar/finalizar/cancelar/reabrir) | Atualizar status do Serviço; derivar ciclos de execução; alimentar indicadores; auditoria | Reconstrução do estado serviço a serviço (hash/partition por `servico_id` garante ordem) |
| `turno.eventos` | `POST /turnos/:id/fechar` | Rotina de serviços não concluídos (cancelar programação sem execução / pausar com execução); gerar `TimeEntry`; disparar notificações | Consistência eventual do fechamento sem bloquear a API |
| `notificacoes` | Qualquer evento relevante (novo serviço programado, lembrete de abrir turno, atraso) | Worker de push (FCM/APNs) — Fase 7 | App móvel recebe avisos sem acoplar a API ao provedor de push |
| `midia.processar` | Upload de fotos (referência/prova) | worker que otimiza, redimensiona e grava no storage | App não espera o processamento |
| `programacao.eventos` | Reprogramação/continuação de serviço | Regras de negócio secundárias + notificações | Efeitos colaterais sem acoplar no request |

### Padrões associados
- **Outbox pattern:** publicar o evento na **mesma transação** do banco (tabela `outbox`) e um produtor entrega ao Kafka — evita perda de mensagem entre DB e broker.
- **Eventos = audit log replay:** o histórico de `ServicoEvento` vira fonte para reconstruir estado (ex.: re-derivar `TimeEntry` de um período a partir dos eventos).
- **Consumidores independentes:** relatórios (Fase 5), app de gestão e auditoria podem consumir o mesmo evento sem interferência.

### Observações
- Kafka resolve **bem** para: eventos de execução, auditar, replay/derivar indicadores, vários consumidores.
- Para **fila simples** (fotos, push), Kafka tende a ser **pesado** — avaliar **Redis Streams** nesses casos; se adotar Kafka, usar um tópico único com o consumer de mídia.
- Infra: subir Kafka via compose (KRaft, sem Zookeeper) + `@nestjs/microservices` transport `KAFKA`.
- Ordem por serviço: partition key = `empresa_id:servico_id`.

## 3. RabbitMQ — ideias de uso

RabbitMQ é um broker de **filas de tarefas**: cada mensagem é entregue a **um** worker (work queue) com **ACK** (confirmação de processamento), **retry** e **Dead Letter** (fila de mensagens que falharam de forma permanente). Faz sentido principalmente para **jobs assíncronos** que precisam de garantia de entrega e reprocessamento.

| Uso | Exemplo no projeto |
|---|---|
| **Processamento de mídia (fotos)** | Upload de fotos de referência/prova → fila `midia.processar` (redimensionar, otimizar, gravar storage); falha permanente vai para a Dead Letter para revisão manual |
| **Notificações (FCM/APNs, e-mail)** | Fila de push com retry: se o provedor estiver fora, a mensagem volta para a fila e tenta de novo; nunca se perde entre API e worker |
| **Job de fechamento de turno** | Longa rotina (cancelar programações, pausar serviços, gerar `TimeEntry`) executada em background com retry por etapa |
| **Relatórios/exportações** | Geração assíncrona de CSV/resumos (Fase 5): 1 worker processa, e a resposta avisa quando ficar pronto |
| **Webhooks/integrações externas** | Entrega garantida de eventos a CRM/billing com ACK e backoff |

Configuração sugerida:
- Exchanges (topic) + filas por operação (`servico`, `turno`, `midia`, `notificacao`) com **ACK**, **prefetch** e `x-dead-letter-exchange` para falha permanente.
- NestJS: `@nestjs/microservices` transport `RABBIT_MQ`; subir via compose (plugin + management na porta 15672).

## Próximos passos sugeridos (quando decidir avançar)
1. Fase atual — sem broker: adicionar apenas **Redis** (cache, refresh token, locks, numeração OS, GEO).
2. Quando surgir `Turno`/`ServicoEvento` (Fase 3/4): usar **Kafka** (`servico.eventos`, `turno.eventos`) com outbox para **histórico/estado**, e **RabbitMQ** (ou Redis Streams) apenas para **jobs** (mídia, push, relatórios).
3. Implantação sempre em branch `chore/` ou `docs/`, código mostrado um a um para aprovação (regras do AGENTS.md).
