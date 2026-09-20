# ServiceControl — ROADMAP

Plano estruturado até a entrega final. Cada item marcado com `[x]` deve receber uma anotação do que foi feito (`> Feito: ...`).

**Foco atual:** Backend da API (Fase 0–5).

---

## Fase 0 — Fundação
- [ ] Criar estrutura do repositório (monorepo: `api/`, `web/`, `app/`).
- [ ] Setup do projeto NestJS + TypeORM + PostgreSQL.
- [ ] Docker Compose com PostgreSQL para desenvolvimento.
- [ ] Configuração `.env` e módulo de configuração (validations).
- [ ] Health check e estrutura base de pastas (modules, common, shared).

## Fase 1 — Núcleo multi-tenant e autenticação

**Decisão de arquitetura (registrada):** o filtro multi-tenant usa **BaseRepository com escopo** (repositório tenant-aware), não RLS por ora (RLS = evolução).

**Modo de trabalho:** camadas pequenas, implementação primeiro; a camada só é considerada concluída após o sistema funcionar. Os **testes** serão construídos somente após as implementações e o funcionamento do sistema.

- [ ] **Camada 1 — Validadores BR** (CPF/CNPJ) — `src/common/validators/`. Regras oficiais (dv, dígitos repetidos).
  > Ajuste: não existe código ainda. Por ora só há validação básica de formato do CNPJ (14 dígitos) na entidade `Empresa`.
- [ ] **Camada 2 — Fundação tenant** — `src/common/tenant/` (TenantContext via AsyncLocalStorage, getEmpresaId/current/run) e `BaseTenantEntity`.
  > Ajuste: não existe código ainda. Modelo mais simples em uso: `Empresa` é a raiz/registro do tenant; `id_empresa` nas tabelas de negócio virá nas camadas seguintes.
- [ ] **Camada 3 — Empresa (entity + migration DDL)** e conexão efetiva do TypeORM.
  > Feito (parcial): entity `Company` (tabela `companies`) criada e conectada ao TypeORM via `TypeOrmModule.forFeature` + `autoLoadEntities` (schema via `synchronize` no dev). **Nomenclatura em inglês** (banco + código): `id` uuid; `cnpj` único global; `name`, `phone`, `logo`, endereço em colunas planas (`address_street`, `address_city`, `address_state`, `address_zipcode`); `status` active/inactive (default active); `created_at`/`updated_at`. Migration DDL ainda não gerada.
- [ ] **Camada 4 — Auth** (JWT, login, guard de autenticação).
- [ ] **Camada 5 — Tenant no ciclo** (interceptor/middleware injetando `id_empresa` do JWT no contexto + guard).
- [ ] **Camada 6 — RBAC por telas** (`permissoes_telas` + guard de telas).
- [ ] **Camada 7 — CRUD Empresa + CRUD Usuário** (senha provisória 1º login, unicidade por empresa; BaseRepository com escopo).
- [ ] Índices compostos iniciando com `id_empresa` nas entidades de negócio.
- [ ] Entidade Empresa + CRUD.
  > Entity `Company` (tabela `companies`) com schema criado; CRUD pendente (Camada 7).
- [ ] Entidade Usuário + CRUD (senha provisória, troca obrigatória no 1º login).
- [ ] Autenticação JWT (login, refresh token).
- [ ] Middleware de tenant derivado do token (nunca do cliente).
- [ ] Permissões por tela (`permissoes_telas`) — guarda de acesso nos endpoints.
- [ ] Validações de unicidade por empresa (padrão composto `id_empresa` + campo).

## Fase 2 — Cadastros base (CRUDs)
- [ ] Filial (com coordenadas + raio p/ validação GPS).
- [ ] Cargo.
- [ ] Funcionário (vínculo filial, equipe, encadeamento `id_superior`).
- [ ] Cliente + ClienteEndereco (principal + alternativos).
- [ ] Equipe (líder, supervisor, jornada padrão; vínculo de membros pela tela da equipe).

## Fase 3 — Core de serviço
- [ ] Tipo de serviço (foto obrigatória, quant. mín/máx).
- [ ] Checklist + ChecklistItem (obrigatório, exige foto).
- [ ] Vínculo Tipo ↔ Checklist (N:N com `momento`: inicio/fim/ambos).
- [ ] Serviço (status, numeração sequencial, continuação `id_servico_origem`).
- [ ] Programação (serviço → equipe; regra de re-programação só p/ serviço "limpo").
- [ ] Regra de continuação (original vira `concluido`).

## Fase 4 — Turno e execução
- [ ] Turno (programado no Web; abertura/fechamento com hora + GPS; 1 por equipe/dia).
- [ ] Validação de raio da filial na abertura do turno.
- [ ] Bloqueio de funcionário com 2 turnos abertos.
- [ ] ServicoEvento (ações: iniciar/pausar/retomar/finalizar/cancelar/reabrir; hora + GPS + funcionário; `id_turno` opcional).
- [ ] ChecklistExecucao + respostas (por momento, com foto quando exigida).
- [ ] Fechamento de turno: rotina de serviços não concluídos (sem execução → `criado`; com execução → `pausado`).
- [ ] TimeEntry (1 linha por turno, persistida, horas previstas/trabalhadas/extras).

## Fase 5 — Relatórios e indicadores (API)
- [ ] Endpoint serviços por equipe/período.
- [ ] Taxa de conclusão e duração média.
- [ ] Horas por equipe (TimeEntry) e extras.
- [ ] Atrasos e turnos não abertos.

## Fase 6 — Web (React)
- [ ] Setup do projeto React (rotas, axios, auth guard por tela).
- [ ] Telas: Empresa, Usuários (permissões por tela), Filiais, Cargos, Funcionários, Clientes, Equipes.
- [ ] Telas: Tipo de serviço, Checklists, Serviços, Programação.
- [ ] Telas: Turnos, indicadores/básicos.

## Fase 7 — App mobile (nativo)
- [ ] Escolha do framework (Flutter / React Native / Kotlin).
- [ ] Login no app + contexto de funcionário/equipe.
- [ ] Abrir/fechar turno (hora + GPS + validação de raio).
- [ ] Lista de serviços do turno + executar (iniciar/pausar/retomar/finalizar).
- [ ] Checklists e fotos (obrigatórias/quantidade do tipo).
- [ ] Modo offline + sincronização (last-write-wins + conflito p/ supervisor).
- [ ] Push (novo serviço, lembrete de turno, alerta de atraso).

## Fase 8 — Entrega
- [ ] Testes (auth, isolamento de tenant, fluxo de execução).
- [ ] Homologação do fluxo ponta a ponta.
- [ ] Deploy: API + Web (e App nas lojas, se aplicável).