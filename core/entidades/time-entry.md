# TimeEntry

Registro de horas trabalhadas da equipe — um resumo por turno. Documento vivo — atualizar a cada decisão.

## Estrutura
```
TimeEntry
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── id_turno (FK → Turno) — 1 por turno
├── id_equipe (FK → Equipe)
├── data
├── horas_previstas (da jornada padrão da equipe)
├── horas_trabalhadas (fechamento − abertura reais do turno)
├── extras (horas além do previsto; 0 se não houver)
├── observacoes (ajuste manual opcional)
└── created_at / updated_at
```

## Decisões registradas
- **Granularidade:** uma linha por **turno da equipe** — a equipe entra e sai junta no mesmo horário.
- **Persistida:** gerada ao **fechar o turno** (base fiável para relatórios; permite ajuste manual futuro via `observacoes`).
- **Intervalos contam na jornada:** almoço/descansos são contabilizados (sem desconto) — se a jornada é 8h, o almoço está incluído.
- **Extras:** horas trabalhadas além do previsto são apuradas (equipe entra/sai junta; pode haver jornada estendida).
- **Previsão:** `horas_previstas` vem da jornada padrão cadastrada na **Equipe**.