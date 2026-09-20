# Equipe

Grupo de funcionários que executa serviços em campo. Documento vivo — atualizar a cada decisão.

## Estrutura
```
Equipe
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── nome (unique por empresa: id_empresa + nome)
├── id_filial (FK → Filial)
├── jornada_inicio (ex.: 08:00 — horário padrão de chegada)
├── jornada_fim (ex.: 17:00 — horário padrão de saída)
├── carga_horaria (ex.: 8h — inclui intervalos)
├── id_lider (FK → Funcionário) — trabalha dentro da equipe
├── id_supervisor (FK → Funcionário, nullável) — supervisiona 1..N equipes
├── status (ativo/inativo)
└── created_at / updated_at
```

## Decisões registradas
- **Membros:** um funcionário pertence a **1 equipe** (líder e ajudantes executam nela). Supervisor é externo — supervisiona várias equipes e não é membro.
- **Hierarquia operacional:** todos os níveis (líder, supervisor, coordenador, gerente) são **Funcionários**.
- **Líder ≠ supervisor:** líder executa dentro da equipe; supervisor supervisiona de fora.
- **Encadeamento opcional** (via `Funcionário.id_superior`): supervisor → coordenador → gerente; nem todo supervisor tem coordenador, nem todo coordenador tem gerente.
- **Cadastro:** tela da Equipe escolhe **líder + ajudantes** (grava `id_equipe` nos funcionários e `id_lider` na equipe).
- **Jornada padrão:** `jornada_inicio`, `jornada_fim` e `carga_horaria` (intervalos incluídos) alimentam o início/fim previstos da programação de turnos no Web e a `horas_previstas` da TimeEntry.