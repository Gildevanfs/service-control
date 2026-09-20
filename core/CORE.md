# ServiceControl — CORE

Visão central do sistema. Documento vivo: atualizar a cada decisão.

## 1. Visão
Sistema distribuído de gestão de serviços de campo:
- **API:** NestJS
- **Web (gestão):** React
- **App mobile:** nativo separado (framework em aberto)

Multiusuário: cada **empresa cliente** gerencia seus próprios dados (modelo tenant): filiais, funcionários, equipes, serviços e relatórios.

## 2. Jornada principal
1. Empresa cadastra **filiais**, **funcionários**, **equipes** e **serviços** no Web.
2. **Programa** o **serviço** para uma **equipe**.
3. A equipe **abre o turno** no app mobile (início com hora + GPS).
4. O turno aberto exibe os **serviços alocados** à equipe.
5. A equipe executa e registra (**status**, checklist, fotos, observações).
6. **Fim do turno** (hora + duração) registra as horas trabalhadas.
7. O Web acompanha em tempo real e consulta **relatórios/indicadores**.

## 3. Entidades
Cada entidade tem seu próprio arquivo em `entidades/`, com estrutura e decisões registradas.

| Entidade | Arquivo | Status |
| --- | --- | --- |
| Empresa | [entidades/empresa.md](entidades/empresa.md) | detalhada |
| Filial | [entidades/filial.md](entidades/filial.md) | detalhada |
| Usuário | [entidades/usuario.md](entidades/usuario.md) | detalhada |
| Funcionário | [entidades/funcionario.md](entidades/funcionario.md) | detalhada |
| Cargo | [entidades/cargo.md](entidades/cargo.md) | detalhada |
| Equipe | [entidades/equipe.md](entidades/equipe.md) | detalhada |
| Serviço | [entidades/servico.md](entidades/servico.md) | detalhada |
| Tipo de serviço | [entidades/tipo-servico.md](entidades/tipo-servico.md) | detalhada |
| Checklist | [entidades/checklist.md](entidades/checklist.md) | detalhada |
| ServicoEvento | [entidades/servico-evento.md](entidades/servico-evento.md) | detalhada |
| ChecklistExecucao | [entidades/checklist-execucao.md](entidades/checklist-execucao.md) | detalhada |
| Cliente | [entidades/cliente.md](entidades/cliente.md) | detalhada |
| ClienteEndereco | [entidades/cliente-endereco.md](entidades/cliente-endereco.md) | detalhada |
| Programação | [entidades/programacao.md](entidades/programacao.md) | detalhada |
| Turno | [entidades/turno.md](entidades/turno.md) | detalhada |
| TimeEntry | [entidades/time-entry.md](entidades/time-entry.md) | detalhada |

## 4. Regras do app mobile
- Início/fim de **turno** registra hora e **GPS** (validação simples de localidade — ver Filial).
- Serviços só aparecem para a equipe com turno aberto.
- **Qualquer membro** da equipe pode aceitar/iniciar/executar (não depende de líder).
- Registro de horas **individual ou por equipe** (a equipe escolhe).
- **Execução do serviço** com ciclo de pausa/retomada: `iniciar → pausar → retomar ×N → finalizar` (+ `cancelar` / `reabrir`). **Cada ação grava um evento** com ação + hora + GPS + funcionário (ServicoEvento). Status: Criado → Alocado → Em transporte → Em execução → (Pausado ↔ Em execução) → Concluído (+ Cancelado / Reaberto).
- **Checklists** conforme o momento definido no vínculo tipo↔checklist: no primeiro `início`, na `finalização` ou em ambos; itens podem ser obrigatórios e exigir foto. Fotos de prova da finalização seguem as regras do tipo (obrigatoriedade e quant. mín/máx).
- **Modo offline**: baixa os serviços do dia, trabalha sem conexão e sincroniza ao voltar (regra simples: last-write-wins, conflito resolvido pelo supervisor).
- **Push**: novo serviço alocado, atualização/alocação, lembrete de turno.

## 5. Indicadores iniciais (básicos)
- Serviços por equipe/período; taxa de conclusão; duração média; horas por equipe; atrasos; turnos não abertos.

## 6. Fora de escopo (evolução futura)
- Faturamento, inventário/estoque, manutenção preventiva recorrente, agendamento otimizado/IA, routing inteligente.

## 7. Em aberto
- Framework do app nativo (Flutter/React Native/Kotlin).
- Autenticação (JWT), refresh token.
- Modelo de funções/papéis (acesso é por telas por enquanto).
- Estratégia de sincronização offline (grau de conflito).
- Super admin da plataforma e campo `plano` da empresa.