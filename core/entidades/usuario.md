# Usuário

Conta de acesso ao sistema (Web e App). Documento vivo — atualizar a cada decisão.

## Estrutura
```
Usuário
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── email (unique por empresa: id_empresa + email)
├── senha (hash) + senha_provisoria (flag: troca obrigatória no 1º login)
├── nome
├── permissoes_telas (lista de telas acessíveis) — acesso por tela, sem papel fixo
├── id_funcionario (FK → Funcionário, nullável, 1:1)
├── status (ativo/inativo)
├── last_login_at
└── created_at / updated_at
```

## Decisões registradas
- **Usuário × Funcionário:** entidades separadas, relação 1:1 (funcionário tem usuário). Funcionário detalhado na própria entidade — inclusive a distinção de quem é usuário puro de gestão vs. funcionário de campo.
- **Acesso:** por **telas** (o usuário acessa determinadas telas, sem função/papel definido). As telas reais serão mapeadas quando definirmos as telas do Web; função/RBAC para depois.
- **E-mail:** único **por empresa** (composite `id_empresa` + email).
- **Primeiro acesso:** admin da empresa cria o usuário (senha provisória); troca obrigatória no primeiro login. Sem cadastro público.
- **Exclusão:** inativação (padrão).
- **Login:** todo acesso (Web e App) passa pelo usuário.