# Tipo de serviço

Template de classificação e regras de execução. Documento vivo — atualizar a cada decisão.

## Estrutura
```
Tipo de serviço
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── nome (unique por empresa: id_empresa + nome)
├── obriga_foto (bool) — fotos de prova obrigatórias na finalização
├── foto_min (quantidade mínima de fotos de prova na finalização)
├── foto_max (quantidade máxima)
├── status (ativo/inativo)
└── created_at / updated_at
```

## Relação com checklists (N:N)
Tabela `tipo_servico_checklist`:
```
├── id_tipo_servico (FK → Tipo de serviço)
├── id_checklist (FK → Checklist)
└── momento (inicio | fim | ambos)
```

## Decisões registradas
- Um tipo pode ter **vários checklists**; um checklist pode ser atrelado a **vários tipos** (N:N).
- O **momento** do vínculo define em quais ações os checklists aparecem (início e/ou fim).
- **Fotos de prova:** obrigatoriedade e quantidade (mín/máx) definidas no tipo de serviço; os itens do checklist também podem exigir foto individualmente.
- Checklists só alcançam o serviço **por meio do tipo** (avulso não é permitido por ora).