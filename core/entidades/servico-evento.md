# ServicoEvento

Log de ações realizadas pela equipe na execução do serviço. Documento vivo — atualizar a cada decisão.

## Estrutura
```
ServicoEvento
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── id_servico (FK → Serviço)
├── id_funcionario (FK → Funcionário)
├── id_turno (FK → Turno, nullável) — vínculo p/ relatórios (qual turno executou)
├── acao (iniciar | pausar | retomar | finalizar | cancelar | reabrir)
├── data_hora
├── latitude
├── longitude
├── created_at
```

## Decisões registradas
- **Toda ação no app grava um evento** com ação + hora + GPS + funcionário.
- Ciclos de execução são **derivados dos eventos**: período ativo = entre `iniciar`/`retomar` e `pausar`/`finalizar`.
- `id_turno` **opcional** liga a execução ao turno para os indicadores (ex.: serviços por turno).
- Fotos de prova da finalização seguem as regras do tipo (`obriga_foto`, `foto_min`, `foto_max`) e não fazem parte do evento em si.