# Serviço

Entidade central do produto: o que será executado pela equipe. Documento vivo — atualizar a cada decisão.

## Estrutura
```
Serviço
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── numero (identificação sequencial por empresa, ex.: OS-0001)
├── id_tipo (FK → Tipo de serviço)
├── id_cliente (FK → Cliente)
├── id_servico_origem (FK → Serviço, nullável) — serviço de continuação aponta para o original
├── descricao (o que fazer — texto)
├── prioridade (alta / média / baixa)
├── data_programada (janela de execução)
├── prazo_limite (data limite)
├── id_endereco_cliente (FK → ClienteEndereco, nullável) — endereço de execução vindo do cliente
├── endereco_execucao (texto livre — usado quando não vincula a endereço do cliente)
├── fotos_referencia (lista de arquivos)
├── observacoes (texto livre)
├── status (criado / alocado / em_transporte / em_execucao / pausado / concluido / cancelado / reaberto)
└── created_at / updated_at
```

## Responsabilidades do Serviço
- Cadastro: tipo, cliente, prioridade, prazo, endereço de execução, fotos de referência.
- Status próprio (transições acima).
- Eventos de execução → **ServicoEvento** (iniciar/pausar/retomar/finalizar/cancelar/reabrir, hora + GPS + funcionário).
- Checklists preenchidos no início/fim → **ChecklistExecucao** (sempre pelos vínculos do tipo).
- Fotos de prova da finalização (quantidade definida pelo tipo de serviço).
- **Não** é responsabilidade do serviço a janela de trabalho da equipe (isso pertence ao **Turno**).

## Decisões registradas
- **Execução** em endereço próprio do serviço (local de atendimento): pode referenciar um endereço do cliente (`id_endereco_cliente`) **ou** ser digitado livre (`endereco_execucao`). Se houver vínculo, o endereço do cliente é usado.
- **Cliente** é entidade própria (CRUD) — ver `cliente.md`.
- **Agenda + prioridade:** data programada, prazo limite e prioridade.
- **Ciclo de execução com pausa/retomada** (N ciclos).
- **Fim de turno:** serviço sem execução volta para `criado` (reprogramável); serviço com execução fica `pausado` e continua com a mesma equipe no próximo turno (regra completa em `turno.md`).
- **Continuação:** quando o serviço executado precisa seguir com outra equipe, cria-se um novo registro de Serviço com `id_servico_origem` apontando para o original; o **original vira `concluido`** (não reprograma).
- **Checklist avulso** fora do vínculo do tipo: não permitido por ora.
- **Fotos de referência** no cadastro para a equipe ver antes de executar.