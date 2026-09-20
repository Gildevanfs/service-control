# Filial

Unidade operacional da empresa. Documento vivo — atualizar a cada decisão.

## Estrutura
```
Filial
├── id (PK, uuid)
├── id_empresa (FK → Empresa; isolamento tenant)
├── nome (unique por empresa: id_empresa + nome)
├── cnpj (unique global, imutável após criar)
├── endereco (simples: rua, número, bairro, cidade, uf, cep)
├── telefone
├── responsavel (gerente/pessoa de contato)
├── latitude (GPS)
├── longitude (GPS)
├── raio_validacao_m (ex.: 100m)
├── status (ativo/inativo)
└── created_at / updated_at
```

## Decisões registradas
- **Papel:** unidade operacional própria da empresa (local onde a equipe se lota e abre turno).
- **GPS:** filial guarda coordenadas + raio; a abertura do turno valida se a equipe está dentro do raio da filial.
- **Unicidade:** nome único **por empresa** (composite `id_empresa` + nome); CNPJ único **global**.
- **Exclusão:** soft delete / inativação (padrão da empresa).