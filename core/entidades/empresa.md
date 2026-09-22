# Empresa

Entidade raiz (tenant). Documento vivo — atualizar a cada decisão.

## Estrutura
```
Empresa
├── id (PK, uuid)
├── nome
├── cnpj (unique global, imutável após criar)
├── telefone
├── endereco (simples: rua, cidade, uf, cep)
├── logo (url de arquivo)
├── status (ativo/inativo)
└── created_at / updated_at
```

## Decisões registradas
- **Nomenclatura (banco + código):** inglês — tabela `companies`, entidade `Company`; colunas `name`, `phone`, `address_*`, `status` (active/inactive); `cnpj` mantido como identificador brasileiro. Domínio/documentos continuam em PT.
- **Banco/ORM:** PostgreSQL + TypeORM.
- **Multi-tenant (shared database):** tabela central de empresas; toda tabela de negócio carrega `id_empresa`. O tenant vem **do JWT** (lado do servidor), nunca de parâmetro do cliente.
- **Isolamento (por ora):** repositório tenant-aware na aplicação + índices compostos iniciando com `id_empresa`; RLS no Postgres fica como evolução.
- **Unicidade:** CNPJ é único **global** na tabela empresas; campos únicos *dentro* da empresa serão compostos (`id_empresa` + campo).
- **Exclusão:** soft delete / inativação (nunca apagar fisicamente).
- **Arquivos:** armazenamento por tenant — `logo/{id_empresa}/...`.
- **Adiado:** papel super admin da plataforma e campo `plano`.

## Status na API (2026-09)
- **CRUD IMPLEMENTADO (2026-09).** `CompaniesService` + `CompaniesController` + DTOs (`create-company.dto`, `update-company.dto`) criados e registrados no `CompaniesModule`. Rotas: `POST/GET /companies`, `GET/PATCH/DELETE /companies/:id`. Soft delete (`status: 'inactive'`), validação `class-validator`, rotas raiz sem prefixo. `cnpj` somente 14 dígitos (validação de dígito verificador = pendente, Camada 1).
- **Histórico:** existia um `companies.service.ts` não registrado que importava `dto/create-company.dto` e `dto/update-company.dto` (nunca criados) — **quebrava o `npm run build`**. Foi removido em 2026-09 e o CRUD foi reimplementado de forma coerente.