# Contratos compartilhados — versão provisória 0.1

O pacote `@lab365/contracts`, consumido pelos workspaces frontend e backend, é a fonte dos identificadores em `shared/src/index.js`. O trabalho é individual e cobre os módulos 2 e 3. A restrição aos módulos 2 e 3 é uma orientação oficial recebida fora do documento; não exige manter telas, menus ou auxiliares de outras funcionalidades.

## Transporte

- JSON com nomes de campos em `snake_case`.
- Rotas Express sem `/api`: por exemplo `POST /auth/login`.
- No desenvolvimento, o navegador chama `/api/auth/login`; o proxy Vite remove `/api` e encaminha para `http://localhost:8888`.
- O cliente adiciona `Authorization: Bearer <token>` nas chamadas com sessão.
- Datas JSON devem usar ISO 8601; idade é medida em meses.
- `400`: dados inválidos. `401`: autenticação ausente/inválida. `403`: perfil sem permissão. `404`: recurso ausente. `409`: conflito de negócio.
- Erro geral oficial: `{ "error": "Mensagem legível." }`; alias `erro` mantido por compatibilidade.
- Validação oficial: `{ "error": "Confira os campos informados.", "campos": { "email": "Informe um e-mail válido." } }`; aliases `erro`/`erros` também retornam para clientes anteriores.
- A resposta 204 não possui corpo e o cliente a converte em `null`.

## Autenticação e sessão

`POST /auth/login` recebe `{ "email": "...", "senha": "..." }`. E-mail é normalizado para minúsculas, sem espaços nas extremidades. A resposta é:

```json
{
  "id": 1,
  "nome": "Nome",
  "email": "nome@example.com",
  "role": "lar",
  "token": "jwt"
}
```

Os únicos valores públicos de `role` são `admin` e `lar`, conforme o template. As chaves `ROLE.EQUIPE` e `ROLE.LAR` no código representam esses valores. `usuarios` contém a equipe; `lares_adotivos` contém os lares. O DTO público nunca inclui senha/hash. O JWT usa HS256, expiração em segundos conforme o padrão JWT, emissor `lab365petamigo`, audiência `lab365petamigo-web` e `sub` composto como `lar:1` ou `admin:1`. A validade/assinatura e o perfil são conferidos no backend; a proteção visual do React não concede permissão.

Senhas novas usam bcrypt com custo 12. Não há compatibilidade automática com SHA-256. O limite técnico do bcrypt é de 72 bytes de senha em UTF-8; a validação dos futuros cadastros deve aplicar esse limite, além do mínimo de 6 caracteres.

A sessão é salva plana sob a chave `@dadoslogin`, igual ao template. O contexto React normaliza internamente para `{ token, usuario }`, sem mudar o formato público. A sessão provisória antiga fica inválida após a mudança de perfis e exige novo login; nenhuma senha ou dado do banco é alterado. Não há uso de `adminUser` nem armazenamento da senha. Uma resposta 401 encerra a sessão correspondente; 403 não encerra o login. Uma resposta atrasada de sessão antiga não pode limpar uma sessão nova.

O retorno oficial usa `{ redirectTo: "/pets/12", petId: 12 }` no estado da navegação. Login/cadastro preservam esse contexto e devolvem `{ petId: 12 }` à página do mesmo pet. O alias anterior `retorno` e a query `?adotar=1` continuam aceitos como destinos internos; a query de cadastro também pode conter `retorno`/`petId`. Não aceitar URLs externas nem repassar petId a outra página.

O requisito 2.1 define `/pets` e `/admin/processos` como destinos padrão. Esses valores continuam no contrato de autenticação. Como adaptação à entrega oficial restrita, somente essas duas entradas redirecionam para `/minhas-adocoes` e `/admin/pets`, respectivamente, sem telas adicionais. Um lar não retorna a uma rota administrativa e a equipe não retorna a uma tela de adoção do lar. Os links para `/pets/:id` e `/admin/lares/:id`, exigidos em 2.3 e 3.1, mantêm os endereços do enunciado; suas telas de destino não fazem parte desta entrega. Sem um destino fornecido por outra aplicação, essas URLs recebem o 404 comum.

## Estados e dados de domínio

| Domínio | Valores |
| --- | --- |
| Adoção | `ANALISE`, `ENTREVISTA`, `APROVADA`, `CONCLUIDA`, `RECUSADA`, `CANCELADA` |
| Pedido em andamento | `ANALISE`, `ENTREVISTA`, `APROVADA` |
| Situação do pet | `DISPONIVEL`, `EM_PROCESSO`, `RESERVADO`, `ADOTADO`, `ARQUIVADO` |
| Moradia | `CASA`, `CASA_QUINTAL`, `APARTAMENTO` |
| Porte | `P`, `M`, `G` |
| Sexo | `M`, `F` ou `null` |
| Experiência | `PRIMEIRO`, `JA_TEVE`, `TEM_OUTROS` |
| Tempo sozinho | `ATE_4H`, `DE_4_A_8H`, `MAIS_8H` |

A situação não é uma coluna editável do pet. A precedência é: arquivado → adoção concluída → aprovada → análise/entrevista → disponível. Pedidos recusados ou cancelados não contam como ativos. A função compartilhada calcula a situação. A API carrega as adoções, calcula `pedidos_em_andamento` e monta `adotado_por` apenas com ID e nome do lar.

Pets são arquivados com `arquivado_em` e `motivo_arquivamento`, sem soft delete. O histórico usa `criado_em` e é ordenado crescentemente por data e ID para desempate. A consulta “Minhas adoções” deverá ordenar pedidos por `atualizado_em DESC` e ID decrescente para desempate.

## Modelagem

- `Usuario`: equipe, e-mail, bcrypt, ativo e datas. `senha_hash` usa `select: false`.
- `LarAdotivo`: cadastro exigido no requisito 2.2, e-mail, bcrypt e datas; `senha_hash` usa `select: false`.
- `Pet`: dados do cadastro, relações com tipo/raça/cor, campos de arquivamento e datas.
- `Adocao`: `pet_id`, `lar_adotivo_id`, motivo, experiência, tempo sozinho, status e datas. Relações `pet`, `lar`, `historico`.
- `AdocaoHistorico`: `adocao_id`, status, observação, `usuario_id` opcional e data. Relações `adocao` e `usuario`.

O banco novo possui índices para um pedido ativo por lar/pet e uma aprovação/conclusão por pet. A consulta desses dados sustenta os grupos de adoção, a situação do pet e os impedimentos de arquivamento dos requisitos implementados.

A unicidade de e-mail é garantida individualmente por tabela. O cadastro público verifica ambas as tabelas e serializa a verificação/gravação com trava consultiva por e-mail normalizado. Os seeds seguem o mesmo protocolo. Qualquer futura criação de conta da equipe também deve usar essa trava. A autenticação recusa contas ambíguas em vez de escolher uma das duas.

## Rotas e responsabilidades

| Backend | Perfil | Situação nesta preparação |
| --- | --- | --- |
| `POST /auth/login` | Público | Implementado na base; requer banco novo preparado |
| `GET /health`, `GET /health/ready` | Público | Implementado |
| `POST /lares-adotivos` | Público | Implementado |
| `GET /minhas-adocoes` | Lar | Implementado |
| `GET /tipos`, `GET /racas`, `GET /cores` | Público | Implementado |
| `GET /pets`, `POST /pets` | Equipe | Implementado |
| `GET /admin/pets/:id`, `PUT /pets/:id` | Equipe | Implementado |
| `PATCH /pets/:id/arquivar`, `PATCH /pets/:id/restaurar` | Equipe | Implementado |

As validações de cadastro do lar, pet e motivo são compartilhadas pelo frontend e backend. A API também confere a existência de IDs de catálogo e aplica os conflitos de negócio.

| Frontend | Responsabilidade |
| --- | --- |
| `/login`, `/cadastro`, `/minhas-adocoes` | Módulo 2 |
| `/admin/pets`, `/admin/pets/novo`, `/admin/pets/:id` (alias anterior com `/editar`) | Módulo 3 |
| `/` | Entrada: login ou tela do perfil autenticado |

## Limites desta versão

O template oficial foi conferido nas referências registradas em `docs/template/ORIGEM.md`. Os testes executam os módulos com TypeORM e PostgreSQL em memória (PGlite) e verificam os contratos de integração. Migração, seed e fluxos principais também foram conferidos no servidor PostgreSQL local, em banco separado. Nenhum dado da etapa anterior foi importado ou alterado. O contato WhatsApp autorizado está configurado; o termo permanece demonstrativo conforme solicitado.


As alterações de pets e o arquivamento/restauração usam transação e trava de escrita no registro do pet. Não há auxiliares reservados para funcionalidades adicionais.
