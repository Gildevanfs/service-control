# Funcionário

Trabalhador da empresa. Documento vivo — atualizar a cada decisão.

## Estrutura
```
Funcionário
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── nome
├── cpf (unique por empresa: id_empresa + cpf)
├── telefone
├── email
├── nascimento (data)
├── admissao (data)
├── id_cargo (FK → Cargo)
├── id_filial (FK → Filial; vínculo de lotação)
├── id_equipe (FK → Equipe, nullável) — pertence a 1 equipe (líder/ajudante executam nela)
├── id_superior (FK → Funcionário, nullável) — encadeamento opcional: supervisor → coordenador → gerente
├── situacao (ativo / afastado / inativo)
└── created_at / updated_at
```

## Decisões registradas
- **Cargo** é entidade própria (cadastro simples — ver `cargo.md`).
- **Vínculo:** 1 filial (lotação).
- **CPF:** único **por empresa** (composite `id_empresa` + cpf).
- **Situação:** ativo / afastado / inativo (soft delete).
- **Habilidades/certificações:** fora por ora (evolução futura).
- **Relação 1:1 com Usuário:** definida em `usuario.md` (usuários de gestão sem funcionário têm `id_funcionario` nulo).
- **Membro de equipe:** `id_equipe` indica a equipe em que o funcionário executa (líder/ajudante). O vínculo é configurado pela tela da Equipe (ver `equipe.md`).
- **Hierarquia:** `id_superior` encadeia supervisor → coordenador → gerente (opcional em cada nível).

## Implementado (feature/funcionario)
- Entidade `Employee` (`api/src/employees/`, tabela/rota `employees`), CRUD com tenant via JWT (`@CurrentUser`).
- `cpf` único por empresa (`company_id` + `cpf`), armazenado em 11 dígitos, validado com `IsValidCpf` e **imutável** após criar (ignorado no update).
- `status` como `ativo | afastado | inativo`; soft delete = `status: 'inativo'`.
- FKs: `position_id` → Cargo, `branch_id` → Filial, `superior_id` → Funcionário (auto-FK).
- `team_id` guardada como coluna reservada **sem FK** até a Equipe existir (evita dependência pendente no `synchronize`).