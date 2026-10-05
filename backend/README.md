# Lab365PetAmigo — API

API de adoção de pets com acompanhamento do processo de adoção. Feita a partir do
[template do Módulo 3](https://github.com/Desenvolvimento-WEB-FullStack/template_projeto_recuperacao_M3)
(Express 5, TypeORM, PostgreSQL, JWT e bcrypt).

## Como rodar

1. Copie `.env_example` para `.env` e preencha os dados do banco e o `JWT_SECRET`.
2. Suba o banco no Docker (usa o `docker-compose.yml` desta pasta, com os dados do `.env`)
   ou use um PostgreSQL já instalado, com um banco vazio.
3. Instale e prepare o banco:

```bash
npm install
npm run db:subir   # sobe o PostgreSQL no Docker (npm run db:parar para desligar)
npm run db:criar   # cria as tabelas a partir de src/database/database.sql
npm run seed:all   # tipos, raças, cores, equipe, pets, lares e adoções de exemplo
npm start          # http://localhost:8888 (ou a PORT do .env)
```

As seeds podem ser rodadas mais de uma vez sem duplicar dados. Para voltar o banco ao
estado inicial das seeds, use `npm run db:resetar`. **Atenção: ele apaga todos os dados do banco do `.env`.**

### O que as seeds criam

- **59 pets**, só cães e gatos (34 cachorros e 25 gatos): filhotes, adultos e idosos, todos os portes,
  alguns sem foto ou sem idade conhecida. Dois deles (Duque e Paçoca) já estão arquivados. Os 20 pets extras ficam em
  `src/database/seeds/dados/petsExtras.js`.
- Tipos `Cachorro` e `Gato`, raças de cães e gatos e cores de pelagem.
- **16 lares adotivos** em várias cidades do CE, RN, PE, PI e PB, com perfis diferentes de moradia.
- **37 pedidos de adoção** espalhados pelos últimos 6 meses: 13 concluídos, 3 aprovados (pets reservados),
  4 em entrevista, 8 em análise (a Pipoca tem 3 lares interessados), 5 recusados e 4 cancelados. O lar `anabeatriz@lares.com` tem 3 pedidos em andamento, um em cada etapa.

### Contas da equipe criadas pelas seeds

Todos têm o mesmo perfil (`admin`) e acesso a todo o painel.

| E-mail                     | Senha    |
|----------------------------|----------|
| admin@lab365petamigo.com   | admin123 |
| rafael@lab365petamigo.com  | admin123 |
| carla@lab365petamigo.com   | admin123 |

Lares de exemplo (todos com a senha `123456`): `recanto@lares.com`, `andrade@lares.com`, `bemtevi@lares.com`
e os demais de `src/database/seeds/lares.seed.js`.

## Quem usa o sistema

- **Equipe da ONG** (tabela `usuarios`, perfil `admin`): faz login e usa o painel.
- **Lar adotivo** (tabela `lares_adotivos`, perfil `lar`): se cadastra (`POST /lares-adotivos`) e faz login
  para pedir adoções. Depois do pedido, o acompanhamento com o adotante é feito pela equipe **pelo WhatsApp**
  (o lar não acompanha nem cancela o pedido pelo site).

`POST /auth/login` procura nas duas tabelas e devolve `{ id, nome, email, role, token }`.
Nas rotas protegidas, envie o cabeçalho `Authorization: Bearer <token>`.

## Processo de adoção

```
ANALISE -> ENTREVISTA -> APROVADA -> CONCLUIDA (pet entregue)
       \-> RECUSADA / CANCELADA (antes de concluir)
```

- O lar envia o pedido pelo site. Todas as mudanças de etapa são feitas pela equipe.
- **Recusar e cancelar exigem o motivo** na observação. Se o adotante desistir (pelo WhatsApp),
  a equipe cancela o pedido e registra, por exemplo, "Cancelado a pedido do adotante pelo WhatsApp".
- Vários lares podem pedir o mesmo pet. Um lar só tem **um** pedido em andamento por pet.
- Ao **aprovar** um lar, os outros pedidos em andamento do mesmo pet viram `RECUSADA` automaticamente.
- Cada mudança gera uma linha em `adocoes_historico`, com a observação e quem da equipe fez a mudança.
- A **situação do pet** não fica gravada: ela é calculada a partir das adoções.
  - `ADOTADO`: tem adoção `CONCLUIDA`.
  - `RESERVADO`: tem adoção `APROVADA`.
  - `EM_PROCESSO`: tem pedido em `ANALISE` ou `ENTREVISTA`.
  - `DISPONIVEL`: nenhum dos casos anteriores.

## Rotas

Erros sempre voltam como `{ error: "mensagem" }`. Erros de validação também trazem
`campos: { campo: "mensagem" }`, para o front mostrar o erro embaixo de cada campo.

### Públicas

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Login da equipe ou do lar |
| POST | `/lares-adotivos` | Cadastro do lar (sem login automático: depois o lar entra por `/auth/login`) |
| GET | `/pets-disponiveis` | Vitrine: pets que ainda não foram adotados nem arquivados (disponíveis, em processo e reservados). Filtros: `tipo_id`, `porte`, `busca` |
| GET | `/pets/:id` | Detalhes do pet, com a situação |
| GET | `/tipos`, `/racas`, `/cores` | Listas para formulários e filtros |

### Protegidas

| Método | Rota | Quem pode | Descrição |
|---|---|---|---|
| POST | `/auth/usuarios` | equipe | Cadastra outro membro da equipe (`nome`, `email`, `senha`) |
| GET | `/pets` | equipe | Todos os pets, inclusive adotados e arquivados, cada um com `adotado_por` (o lar que adotou) e `pedidos_em_andamento`. Filtros: `tipo_id`, `porte`, `busca`, `situacao` |
| POST | `/pets` | equipe | Cadastra pet |
| GET | `/admin/pets/:id` | equipe | Pet para a tela de edição do painel |
| PUT | `/pets/:id` | equipe | Atualiza só os campos enviados |
| PATCH | `/pets/:id/arquivar` | equipe | Arquiva o pet (`{ motivo }`, obrigatório): sai da vitrine e não recebe pedidos, mas continua no histórico. Só para pet sem pedido em andamento e não adotado |
| PATCH | `/pets/:id/restaurar` | equipe | Devolve o pet arquivado à vitrine |
| GET | `/lares-adotivos` | equipe | Lares com o dossiê completo de cada um: dados, `pets_sob_guarda`, `pedidos_em_andamento` e `adocoes` (com histórico). Filtro: `busca` |
| GET | `/lares-adotivos/:id` | equipe | Dossiê: dados, pets sob guarda e pedidos com histórico |
| PUT | `/lares-adotivos/:id` | equipe | Atualiza só os campos enviados |
| POST | `/adocoes` | lar | Pedido de adoção do lar logado (`pet_id`, `motivo`, `experiencia`, `tempo_sozinho`); o lar vem do token |
| GET | `/adocoes` | equipe | Todos os pedidos. Filtros: `status` (um, vários separados por vírgula, ou `ATIVOS`), `pet_id`, `lar_adotivo_id` |
| GET | `/minhas-adocoes` | lar | Pedidos do lar logado (tela "Minhas adoções"). Filtros: `status`, `pet_id` |
| GET | `/pets/:id/minha-adocao` | lar | Pedido do lar logado para o pet, em andamento ou concluído (página do pet). Sem pedido assim, responde 204 |
| GET | `/adocoes/:id` | equipe | Detalhe com histórico, o lar completo e os outros pedidos do pet |
| PATCH | `/adocoes/:id/status` | equipe | Muda a etapa (`{ status, observacao }`; a observação é obrigatória para `RECUSADA` e `CANCELADA`) |

### Valores aceitos

- `porte`: `P`, `M`, `G`. `sexo`: `M`, `F` (opcional).
- `moradia`: `CASA`, `CASA_QUINTAL`, `APARTAMENTO`.
- `experiencia`: `PRIMEIRO`, `JA_TEVE`, `TEM_OUTROS`.
- `tempo_sozinho`: `ATE_4H`, `DE_4_A_8H`, `MAIS_8H`.
- Telefone `(85) 99999-9999`, CEP `00000-000`, estado como UF (`CE`).
