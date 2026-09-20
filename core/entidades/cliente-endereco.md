# ClienteEndereco

Endereços do cliente (principal + alternativos). Documento vivo — atualizar a cada decisão.

## Estrutura
```
ClienteEndereco
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── id_cliente (FK → Cliente)
├── endereco (simples: rua, número, bairro, cidade, uf, cep)
├── referencia (texto opcional, ex.: "Depósito", "Filial cliente")
├── principal (bool) — 1 por cliente
├── status (ativo/inativo)
└── created_at / updated_at
```

## Decisões registradas
- Cliente tem **1 endereço principal + lista de alternativos** (flag `principal`, 1 por cliente).
- **Usado pelo Serviço:** o endereço de execução pode referenciar um `ClienteEndereco` (`id_endereco_cliente` no Serviço) ou ser digitado livre (`endereco_execucao`). Ao editar o endereço do cliente depois, a referência do serviço continua válida.