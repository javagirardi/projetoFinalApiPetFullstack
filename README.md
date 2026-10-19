# Lab365PetAmigo — módulos 2 e 3

Implementação individual dos **módulos 2 e 3**, iniciada no código local e posteriormente conferida com o template oficial. O escopo oficial abrange exclusivamente os requisitos 2.1–2.3 e 3.1–3.4, além das orientações gerais da avaliação. Não há telas vazias ou menus para funcionalidades adicionais. Consulte [a conferência e a origem](docs/template/ORIGEM.md), [os contratos](docs/CONTRATOS.md) e [a situação da entrega](docs/BASE_PROVISORIA.md).

## Estrutura

```text
frontend/   React + Vite + React Router
backend/    Node.js + Express + TypeORM + PostgreSQL
shared/     @lab365/contracts: perfis, enums, sessão e regras compartilhadas
docs/       Contratos, origem e progresso da implementação
scripts/    Preparação de arquivos locais de configuração
```

O visual usa degradês em lilás e azul pastel, navegação compartilhada e fotografias recuperadas do projeto anterior. As imagens conhecidas ficam no próprio frontend. Confira a [direção visual e a origem das fotos](docs/VISUAL.md).

As três pastas anteriores foram preservadas localmente e ignoradas pelo Git da nova entrega. Não devem ser usadas para iniciar os novos serviços.

## Preparar o ambiente

Requer Node.js 22 ou superior e PostgreSQL. Executar na raiz:

```powershell
npm install
npm run setup
```

O setup cria `backend/.env` e `frontend/.env` sem substituir arquivos existentes e gera um segredo de autenticação e uma senha inicial de equipe. Os valores ficam somente em `backend/.env`; não são impressos nem enviados ao frontend. Preencha `DB_USER` e `DB_PASSWORD` conforme seu PostgreSQL local. O `.env.example` não contém credenciais reais.

Use um banco separado, chamado `lab365petamigo_modulo4`. A migração inicial não converte a base antiga nem adivinha o significado de seus status. Para criar o banco de desenvolvimento, execute `npm run db:create`; esse comando só permite esse nome e preserva um banco já existente. Alternativamente, crie-o por uma conexão administrativa:

```sql
CREATE DATABASE lab365petamigo_modulo4;
```

Depois de configurar o `.env`, estes comandos executam ações explícitas:

```powershell
npm run db:check
npm run db:migrate
npm run db:seed
```

`db:check` verifica apenas a conexão. `db:migrate` cria as tabelas do banco novo. `db:seed` preenche os catálogos e cria a conta de equipe configurada em `ADMIN_EMAIL` e `ADMIN_PASSWORD`; não redefine a senha de contas existentes. A migração recusa bancos com tabelas da aplicação já existentes. Migrações e seed **não** são executados ao iniciar o servidor. `synchronize` permanece desativado, mesmo que um `.env` herdado contenha `DB_SYNC=true`.

Neste ambiente, o banco novo já foi criado, migrado e recebeu catálogos, conta inicial e dados fictícios de demonstração. Nenhum comando de escrita foi aplicado ao banco da etapa anterior.

## Executar

Em dois terminais na raiz:

```powershell
npm run dev:backend
```

```powershell
npm run dev:frontend
```

- Frontend: `http://localhost:5173`.
- Backend: `http://localhost:8888`.
- Chamadas do navegador: `/api/...`, encaminhadas pelo proxy Vite sem o prefixo `/api` ao Express.
- `GET /health`: disponibilidade da aplicação.
- `GET /health/ready`: disponibilidade da conexão do banco, sem expor configurações.
- `POST /auth/login`: autenticação da equipe e do lar no contrato novo.

As credenciais da etapa anterior não são importadas automaticamente. O login da equipe fica utilizável após preparar o banco novo e executar o seed. Lares criam suas contas na tela `/cadastro`. Para explorar os estados de adoção e os filtros do painel, consulte as [contas fictícias e o roteiro de demonstração](docs/DEMONSTRACAO.md).

## Validação

```powershell
npm test
npm run build
```

Os testes usam portas HTTP locais temporárias e PostgreSQL em memória (PGlite), sem alterar o servidor local. Verificam bcrypt, JWT, perfis, erros HTTP, isolamento dos pedidos, cadastro, edição parcial, arquivamento/restauração, sessão e situação do pet. O SQL e as transações dos módulos são executados pelo TypeORM real, com verificação da modelagem e das restrições. Migração, seed, cadastro, login, ViaCEP, consulta e arquivamento/restauração também foram conferidos no ambiente local pelo navegador.

## Escopo implementado

- Organização por workspaces com um único lockfile.
- Contratos compartilhados, com `role` como `admin` (equipe) ou `lar`, conforme o template.
- Entidades novas e migração inicial para banco vazio, sem soft delete de pets.
- Base de autenticação com bcrypt e JWT, com identificação separada dos dois perfis.
- Sessão centralizada no localStorage, cliente HTTP, controle de rotas e retorno à origem.
- Login por e-mail adaptado do painel anterior e menus por perfil.
- Cadastro público de lar, com máscaras, ViaCEP, validações e retorno ao login preservando origem.
- “Minhas adoções”, com grupos, etapas, respostas, histórico e datas de conclusão/encerramento.
- Catálogos públicos e listagem administrativa com filtros, contagens e situação calculada.
- Formulário compartilhado de cadastro/edição de pets, com prévia de foto e atualização parcial.
- Arquivamento com motivo, impedimentos e restauração, preservando os históricos.

Os módulos 2 e 3 estão implementados localmente. As referências de navegação expressamente exigidas nesses requisitos são preservadas, sem implementar suas telas de destino. Para permitir o uso isolado, as entradas padrão de login redirecionam a “Minhas adoções” ou à gestão de pets; detalhes em [contratos](docs/CONTRATOS.md). A implementação foi integrada na develop pelo PR #1 em 18/10/2026. A integração final em main permanece pendente. O quadro [Lab365PetAmigo](https://trello.com/b/LexKmACW/lab365petamigo) já foi criado e conferido. Não considerar cartões concluídos antes do merge conforme o enunciado.

O termo usa lorem ipsum demonstrativo, conforme solicitado. O WhatsApp autorizado foi configurado em `VITE_ONG_WHATSAPP` no ambiente local e no `.env.example`. Cada pedido ativo apresenta o link de contato com mensagem contextual. A configuração pode ser substituída por ambiente; o texto do termo permanece demonstrativo por autorização do usuário.

## Git e entrega

Repositório: [projetoFinalApiPetFullstack](https://github.com/javagirardi/projetoFinalApiPetFullstack). A versão atual está na [develop](https://github.com/javagirardi/projetoFinalApiPetFullstack/tree/develop), após o [merge do PR #1](https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1). A integração final em main ainda está pendente.

O quadro público [**Lab365PetAmigo**](https://trello.com/b/LexKmACW/lab365petamigo) foi criado. O estado de publicação e os links do serviço são mantidos em `docs/avaliacao/TRELLO.md`.
