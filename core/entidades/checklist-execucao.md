# ChecklistExecucao

Instância preenchida de um checklist na execução de um serviço. Documento vivo — atualizar a cada decisão.

## Estrutura
```
ChecklistExecucao
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── id_servico (FK → Serviço)
├── id_checklist (FK → Checklist)
├── id_funcionario (FK → Funcionário)
├── momento (inicio | fim)
├── data_hora
├── latitude (opcional)
├── longitude (opcional)
├── itens_resposta (lista de ChecklistExecucaoItem)
└── created_at
```

```
ChecklistExecucaoItem
├── id (PK, uuid)
├── id_execucao (FK → ChecklistExecucao)
├── id_item (FK → ChecklistItem)
├── valor (texto da resposta)
├── foto (arquivo, quando o item exige foto)
└── created_at
```

## Decisões registradas
- Checklists surgem **apenas pelo vínculo com o tipo do serviço** (momento: `inicio`/`fim`).
- `inicio`: exibidos no **primeiro início**; retomadas não re-solicitam.
- `fim`: exibidos na **finalização**.
- `ambos`: aparecem nos dois momentos.
- Itens com `exige_foto` obrigam o anexo de foto na resposta.