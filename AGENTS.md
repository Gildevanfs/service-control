# AGENTS.md — ServiceControl

Instruções para agentes trabalhando neste repositório. Código/identificadores em inglês; documentação em português (ROADMAP.md, CORE.md, CORE/core, core/*.md).

## Regras de conduta (obrigatórias)
- **Toda alteração de arquivos (criar, editar, mover ou excluir) deve ser ANTES solicitada e autorizada pelo usuário** — só executa após a aprovação explícita.
- **Sempre remova arquivos não úteis.** Scripts de diagnóstico/perfuração (`.ps1`, probes, smokes temporários), artefatos de build, lixo e arquivos que não reconhece **devem ser apagados do disco** — nunca deixe lixo no projeto. Confira ao final de cada tarefa com `Get-ChildItem`.
- **Sempre valide até não haver erro.** Build (`npm run build`), lint e smoke tests devem passar **sem nenhum erro** antes de dar a tarefa por concluída. Se algo falhar, corrija e re-verifique até `build` retornar 0 erros.
- **Antes de todo commit, verifique a integridade do projeto:** containers no ar, `docker compose ps` sem falhas, logs da API sem erros e smoke das rotas essenciais (`/health`, login, rotas protegidas) respondendo — só então commitar.
- Sempre responda em **português**; identifique claramente scripts/arquivos que você criou ao mencioná-los.
- Não execute ações finais (Deletar arquivos, modificações e outros) sem consultar se pode realizar a ação.


## Comandos (web)
- Tudo roda via **Docker** na raiz do projeto.
- Subir/rebuild da API: `docker compose up -d --build api` (recrie o container: `--force-recreate`).
- Ver estado: `docker compose ps` · Logs da API: `docker logs servicecontrol-api`.
- **Portas:** API host `1511 → container 3000`; PostgreSQL host `5432`. (não uses 1511/3000 do smoke anterior — a porta host publicada é 1511).
- DB: user/senha/db `servicecontrol`, Postgres 16, container `servicecontrol-db`.
- O container `servicecontrol-api` roda `dist/` **compilado** — reconstrua após alterar código (não há hot-reload no container).

## Arquitetura (NestJS + TypeORM)
- Rotas **NA RAIZ, sem prefixo global**: `/health`, `/companies`, `/users` … (não usa `/api/v1`; `main.ts` não define `setGlobalPrefix`).
- `synchronize: true` no TypeORM — schema pela entidade, snake_case nas colunas (`company_id`, `password_hash`, `created_at`).
- Entidades/serviços em inglês; entidades de domínio documentadas em `core/` (`empresa.md`, `usuario.md`, etc.).
- **CRUD de Usuário completo** (`api/src/users/`): entity, service (bcryptjs hash), controller, module, DTOs. Rotas: `POST/GET /users`, `GET/PATCH/DELETE /users/:id` + filtro por `companyId`.
- **CRUD de Empresa completo** (`api/src/companies/`): entity, service, controller, module, DTOs. Rotas: `POST/GET /companies`, `GET/PATCH/DELETE /companies/:id` (CNPJ 14 dígitos).
- **Auth JWT** (`api/src/auth/`): `POST /auth/login` (bcrypt + JWT), `JwtAuthGuard` protege `/users` e `/companies` (`Authorization: Bearer <token>`); `JWT_SECRET`/`JWT_EXPIRES_IN` no env. Payload: `sub`, `email`, `companyId`.
- **Seed dev/teste** (`api/src/seed/`): no boot cria empresa (`SEED_COMPANY_CNPJ=11222333000181`) + admin `admin@servicecontrol.com.br` / `admin123` (configurável via `SEED_*`).

## Convenções
- Validação via `class-validator` + `ValidationPipe({ whitelist: true, transform: true })` (global, em `main.ts`).
- Soft delete: nunca apaga fisicamente — marca `status: 'inactive'`.
- Senhas: hash `bcryptjs` (não bcrypt), com `temporaryPassword: true` no primeiro cadastro.
- UUIDs como PK; multi-tenant por `companyId`.
- Build: `cd api && npm run build` (0 erros é o critério de "ok"). Smoke via `Invoke-RestMethod` nas rotas da raiz.

## Gitflow (GitHub Flow — adotado em 2026-09)
- `main` é a única branch de longo prazo e **sempre deve estar deployável** (verde).
- Trabalho SEMPRE em branch curta + **Pull Request**: `feature/<slug>` (novo), `fix/<slug>` (correção), `refactor/<slug>`, `docs/<slug>`, `chore/<slug>`.
- **Nunca commitar/forçar direto na `main`**; merge só via PR com review.
- Conventional Commits (já em uso): `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- Antes de merge, PR deve passar no build (`npm run build` sem erros) e smoke de rotas.
- Releases futuras: `main` recebe tag semântica (`v0.1.0`) — GitHub Flow não cria branch `develop`/`release`.
