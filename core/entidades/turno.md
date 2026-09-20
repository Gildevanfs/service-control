# Turno

Janela de trabalho da equipe no dia. Documento vivo — atualizar a cada decisão.

## Estrutura
```
Turno
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── id_equipe (FK → Equipe)
├── data (dia do turno — unique: id_empresa + id_equipe + data)
├── inicio_previsto (programado no Web)
├── fim_previsto (programado no Web)
├── status (programado / aberto / fechado / cancelado)
├── aberto_em (hora real de abertura no app)
├── aberto_por (FK → Funcionário — quem abriu em nome da equipe)
├── latitude_abertura / longitude_abertura (GPS check-in)
├── dentro_raio_filial (bool — validação do raio da filial da equipe)
├── fechado_em (hora real de fechamento no app)
├── fechado_por (FK → Funcionário)
├── latitude_fechamento / longitude_fechamento (GPS check-out)
└── created_at / updated_at
```

## Regras de operação
- **Serviços visíveis:** no app, os serviços programados (Programação `ativa`) da equipe aparecem quando o turno está `aberto`.
- **Bloqueio:** um funcionário não pode estar em 2 turnos abertos ao mesmo tempo.
- **Fechamento manual** (hora + GPS); se o turno ficar aberto além do `fim_previsto`, alerta. Sem auto-fechamento.

## Regra de fechamento de turno (serviços não concluídos)
Ao fechar o turno, para cada serviço programado da equipe:
- **Sem nenhuma execução registrada** (nada foi feito — sem eventos/preenchimento): a **Programação é cancelada** (motivo: "fim de turno sem execução") e o **serviço volta para `criado`**, ficando disponível para nova Programação.
- **Com execução registrada** (houve início/preenchimento/fotos): a **Programação permanece `ativa`**; o **serviço fica `pausado`**, preservando todo o histórico; no **próximo turno aberto da equipe** o serviço reaparece e **continua de onde parou**.

## Decisões registradas
- **Turno da equipe:** um membro abre em nome do time (`aberto_por`).
- **1 turno por equipe por dia** (unique composto `id_empresa` + `id_equipe` + `data`).
- **Turno programado no Web:** início/fim esperados; alerta se não abrir na janela.
- **Status `cancelado`:** turno programado desfeito antes de abrir.
- **Validação de GPS:** abertura valida se a localização está dentro do raio da filial da equipe (`dentro_raio_filial`).
- A hora + GPS de abertura/fechamento ficam **no próprio Turno** (2 momentos, sem log de eventos).
- `id_turno` (opcional no `ServicoEvento` e na `ChecklistExecucao`) liga as execuções ao turno para relatórios.