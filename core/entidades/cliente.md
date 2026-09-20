# Cliente

Pessoa ou empresa que solicita/para quem o serviço é executado. Documento vivo — atualizar a cada decisão.

## Estrutura
```
Cliente
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── tipo (pf | pj)
├── nome (nome completo ou razão social)
├── cpf_cnpj (unique por empresa: id_empresa + cpf_cnpj)
├── telefone
├── email
├── enderecos (lista de ClienteEndereco — 1 principal + alternativos)
├── observacoes (texto livre)
├── status (ativo/inativo)
└── created_at / updated_at
```

## Decisões registradas
- **Tipos:** pessoa física (**pf**) e pessoa jurídica (**pj**).
- **Contato único:** um telefone + um e-mail direto no cadastro (sem lista de contatos por ora).
- **Unicidade:** CPF/CNPJ único **por empresa** (composite `id_empresa` + cpf_cnpj).
- **Endereços:** em entidade própria `ClienteEndereco` (principal + alternativos); o endereço de execução do serviço pode referenciar um deles ou ser digitado livre.
- **Referenciado por:** `Serviço.id_cliente`.