# Checklist

Template de itens preenchíveis pela equipe na execução de um serviço. Documento vivo — atualizar a cada decisão.

## Estrutura
```
Checklist
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── nome (unique por empresa: id_empresa + nome)
├── itens (lista de ChecklistItem)
├── status (ativo/inativo)
└── created_at / updated_at
```

```
ChecklistItem
├── id (PK, uuid)
├── id_checklist (FK → Checklist)
├── descricao (o que verificar/preencher)
├── ordem
├── obrigatorio (bool)
├── exige_foto (bool) — resposta deve incluir foto
└── created_at / updated_at
```

## Decisões registradas
- **Genérico e reutilizável:** atrelado a um ou mais tipos de serviço (N:N via `tipo_servico_checklist`, com **momento**).
- **Checklist avulso** por serviço: não por ora.
- Só aparece para a equipe se o tipo do serviço o tiver em `inicio` ou `fim`.