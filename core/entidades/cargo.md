# Cargo

Cargo/função do funcionário na empresa. Documento vivo — atualizar a cada decisão.

## Estrutura
```
Cargo
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── nome (unique por empresa: id_empresa + nome)
├── status (ativo/inativo)
└── created_at / updated_at
```

## Decisões registradas
- **Cadastro simples:** lista de cargos da empresa, referenciado por Funcionário (`id_cargo`).
- **Código (2026-09):** entidade `Position` (tabela `positions`, rota `/positions`); `nome` único por empresa (`company_id` + `name`).