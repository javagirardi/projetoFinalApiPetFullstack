# Lab365PetAmigo — template do front-end

Ponto de partida do front-end (React + Vite). As telas estão vazias: cada equipe implementa
as telas a partir dos requisitos. A API é a da pasta `backend/`.

## O que já vem pronto

- **Rotas** (`src/App.jsx`) de todas as telas, ainda sem proteção.
- **Menus**: o do site (`src/components/Header.jsx`) e o lateral do painel
  (`src/components/AdminLayout/AdminLayout.jsx`: Processos, Pets, Lares adotivos, Ver site e Sair).
- **Cliente da API** (`src/services/api.ts`): instância do axios (`import api from ...services/api`) que já envia o token
  salvo no localStorage na chave `@dadoslogin`. A resposta vem em `data`; a mensagem de erro da API, em `err.response?.data?.error`.
- **Formulário de login** (`src/pages/Auth/Login/Login.jsx`): já faz o `POST /auth/login` e mostra o erro da API.

## Lógica a implementar

- **Sessão**: depois do login, salvar `{ token, id, nome, email, role }` no localStorage (chave `@dadoslogin`)
  e permitir sair (apagar a sessão).
- **Redirecionamento do login**: a equipe vai para `/admin/processos`, o lar para `/pets`
  (ou para a tela de onde veio, `redirectTo`).
- **Proteção das rotas** (`src/App.jsx`):
  - a Home é de visitantes e lares adotivos; a equipe vai direto para o painel;
  - "Minhas adoções" é só do lar adotivo (sem login, vai para o login e volta depois);
  - o painel `/admin` é só da equipe.
- **Menus conforme a sessão**: no site, o visitante vê Home, Pets e Entrar; o lar vê Home, Pets,
  Minhas adoções, o nome e Sair; a equipe vê Pets, Painel admin, o nome e Sair. No painel, "Olá, nome" e Sair.

## Telas a implementar

| Rota | Arquivo | API |
|---|---|---|
| `/` | `pages/Site/Home/Home.jsx` | — |
| `/pets` | `pages/Site/Pets/Pets.jsx` | `GET /pets-disponiveis` |
| `/pets/:id` | `pages/Site/PetDetalhe/PetDetalhe.jsx` | `GET /pets/:id`, `GET /pets/:id/minha-adocao`, `POST /adocoes` |
| `/cadastro` | `pages/Auth/Cadastro/Cadastro.jsx` | `POST /lares-adotivos` |
| `/minhas-adocoes` | `pages/Site/MinhasAdocoes/MinhasAdocoes.jsx` | `GET /minhas-adocoes` |
| `/admin/processos` | `pages/Admin/Processos/Processos/Processos.jsx` | `GET /adocoes` |
| `/admin/processos/:id` | `pages/Admin/Processos/ProcessoDetalhe/ProcessoDetalhe.jsx` | `GET /adocoes/:id`, `PATCH /adocoes/:id/status` |
| `/admin/pets` | `pages/Admin/Pets/PetsAdmin/PetsAdmin.jsx` | `GET /pets`, `PATCH /pets/:id/arquivar`, `PATCH /pets/:id/restaurar` |
| `/admin/pets/novo` e `/admin/pets/:id` | `pages/Admin/Pets/PetForm/PetForm.jsx` | `POST /pets`, `GET /admin/pets/:id`, `PUT /pets/:id`, `GET /tipos`, `/racas`, `/cores` |
| `/admin/lares` e `/admin/lares/:id` | `pages/Admin/Lares/Lares/Lares.jsx` (dossiê de cada lar na própria listagem) | `GET /lares-adotivos` |

## Como rodar

1. Suba a API (veja o README da pasta `backend/`).
2. Copie `.env.example` para `.env` (o padrão já aponta para `http://localhost:8888`).
3. Instale e rode:

```bash
npm install
npm run dev
```

## Contas de teste (criadas pelas seeds do back-end)

- Equipe: `admin@lab365petamigo.com` / `admin123`
- Lar adotivo: `anabeatriz@lares.com` / `123456`
