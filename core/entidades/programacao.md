# Programação

Vínculo serviço → equipe (quem executa o quê). Documento vivo — atualizar a cada decisão.

## Estrutura
```
Programação
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── id_servico (FK → Serviço)
├── id_equipe (FK → Equipe)
├── data_programacao
├── status (ativa / cancelada)
├── motivo_cancelamento (texto, quando cancelada)
└── created_at / updated_at
```

## Decisões registradas
- **1 serviço → 1 equipe ativa por vez**; programação **definitiva**, feita no **Web** por quem tiver acesso à tela.
- **Re-programação apenas para serviço "limpo"**: sem eventos de execução, sem checklist preenchido, sem fotos.
- **Cancelamento automático no fim de turno:** serviço programado sem nenhuma execução ao fechar o turno tem a Programação cancelada (motivo: "fim de turno sem execução") e volta para `criado`.
- **Continuação:** se o serviço já tem execução e precisa seguir com outra equipe, cria-se um **novo registro de Serviço** (com `id_servico_origem`) em vez de reprogramar.