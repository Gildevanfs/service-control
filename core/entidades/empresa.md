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