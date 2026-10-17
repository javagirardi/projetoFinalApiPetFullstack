# Origem e situação da base

Data: 17/10/2026.

Organização individual: o usuário informou que desenvolve o trabalho sozinho. A orientação oficial, recebida fora do documento avaliativo, restringe a entrega aos módulos 2 e 3. As orientações gerais do documento continuam aplicáveis.

## Decisão do usuário

Após a tentativa de download do template oficial ser recusada na etapa de permissão, o usuário escolheu: **“Usar o código local como base provisória”**.

O início foi provisório no código local, por escolha do usuário. Em seguida, o usuário autorizou continuar a conferência oficial: o template foi baixado, suas branches main/develop comparadas e seus contratos e a estrutura aplicável aos requisitos 2 e 3 incorporados. A proveniência e as diferenças preservadas estão em `docs/template/ORIGEM.md`. O destino passou a ser um repositório pessoal novo, por orientação posterior do usuário. O histórico parte da referência oficial já baixada, sem incorporar ou alterar o repositório da equipe anterior.

## Origem local

- Backend: modelagem TypeORM e configuração Express da pasta `api_pets_equipe_7/`, adequadas para os novos contratos.
- Frontend: entrada React e CSS do painel em `senai_projeto_site_pets-main/admin/`, com nova organização de rotas, autenticação e serviços.
- API JSON em `servidor_api_pets/`: preservada como referência; não usada pelo frontend novo.

As pastas originais não foram movidas nem alteradas. Na nova entrega, a raiz usa `frontend/`, `backend/` e `shared/`.

## Implementado localmente

- Workspaces npm e configuração de execução.
- Perfis oficiais `admin`/`lar`, estados, enums, rotas principais e DTO de usuário em pacote compartilhado; login e sessão planos em `@dadoslogin`.
- Regra de situação do pet corrigida conforme a tabela textual do enunciado.
- Modelo das oito tabelas e migração para um banco novo, com índices de integridade para pedidos ativos e adoção exclusiva.
- Sincronização e migrações automáticas desativadas.
- Base de login, bcrypt, JWT e autorização por perfil.
- Cliente HTTP com Bearer e erros por campo; sessão e retorno interno à origem.
- Menus e rotas protegidas restritos às funcionalidades da entrega.
- Configuração local sem credenciais no código versionado.
- Repositório pessoal `javagirardi/projetoFinalApiPetFullstack` criado e configurado em origin. Conta javagirardi autenticada. Branch de consolidação `feature/modulos-2-e-3`; main/develop partem do commit oficial 67e6190. Estado da publicação em `docs/avaliacao/DESTINOS_GITHUB.md`.
- Migração e restrições verificadas em PostgreSQL em memória (PGlite), incluindo coerência entre colunas das entidades e banco criado; nenhum acesso ao banco antigo nesses testes.
- Banco `lab365petamigo_modulo4` criado no PostgreSQL local, migrado e preenchido com catálogos e conta inicial.
- Cadastro público completo do lar, com ViaCEP, máscaras, confirmação/aceite no frontend e conflitos de e-mail em ambos os perfis.
- “Minhas adoções” com consulta isolada pelo token, histórico ordenado, três grupos e datas obtidas das etapas.
- Listagem administrativa com filtros, situação, contagens e link do adotante; cadastro/edição com catálogos públicos e prévia da foto.
- Arquivamento/restauração com motivo e impedimentos, em transações com trava no pet; sem exclusão de histórico.
- Dados fictícios de demonstração com sete pets e contas para revisar ambos os perfis. Credenciais em `docs/DEMONSTRACAO.md`.
- Termo demonstrativo lorem ipsum autorizado pelo usuário e WhatsApp autorizado configurado, com link contextual por pedido ativo.
- Header/AdminLayout adaptados ao escopo oficial. Telas vazias e auxiliares de funcionalidades adicionais removidos; consultas e travas necessárias à gestão de pets permanecem dentro do módulo 3.
- Referências oficiais documentadas, CI/modelo de PR e especificação do quadro Lab365PetAmigo com cinco listas e 11 cartões.
- Commit da implementação publicado em feature/modulos-2-e-3; main/develop com a base oficial e PR #1 aberto em rascunho. CI do commit da implementação aprovada no GitHub; revisão e merges pendentes.

## Pendente

- Conferir o PR #1 (rascunho) da consolidação, resolver os apontamentos da auditoria e integrar em develop; depois abrir o PR final para main. Não declarar o Git Flow concluído antes desses merges.
- Criar o quadro Lab365PetAmigo no Trello quando o acesso for habilitado e registrar os PRs/merges reais. Os arquivos em `docs/avaliacao/` são a preparação revisável, não um quadro publicado.
- Validar a entrega dos módulos 2 e 3, registrar cartões/PRs e preparar apresentação/entrega.

## Decisões de contrato

`ROLE.EQUIPE` vale `admin` e identifica a equipe da ONG; `ROLE.LAR` vale `lar` e identifica a conta da tabela `lares_adotivos`, conforme o template. O token inclui a identidade composta pelo perfil e ID; IDs numéricos iguais nas duas tabelas representam contas diferentes. Senhas da etapa anterior e seus hashes SHA-256 não são aceitos automaticamente pela base nova.

Não há migração automática de dados antigos: a equivalência dos status antigos é ambígua e os lares anteriores não possuem todas as credenciais/campos exigidos. Essa importação exige um plano próprio caso a equipe precise preservar esses dados na nova versão.

## Validação

- Suíte ampliada com os fluxos HTTP dos módulos 2 e 3, executando consultas e transações do TypeORM contra PostgreSQL em memória, além dos testes de sessão/contratos.
- A suíte cobre os contratos oficiais e os fluxos dos requisitos 2.1–2.3 e 3.1–3.4.
- Execução atual: **34 testes aprovados** (5 frontend, 23 backend incluindo subtestes, 6 contratos), com build de produção aprovado.
- `npm run build`: build de produção do frontend aprovado.
- As oito entidades TypeORM tiveram seus metadados construídos e as colunas comparadas com o schema criado pela migração no PGlite.
- `.env`, dependências, build e pastas antigas estão ignorados pelo Git.
- No navegador: máscaras, consulta ao ViaCEP, validação, cadastro e retorno ao login, autenticação de ambos os perfis, grupos/históricos das adoções, filtros de pets e arquivamento/restauração foram conferidos com dados fictícios.
- O PostgreSQL da etapa anterior permaneceu intacto. Todas as gravações locais ocorreram no banco separado da nova etapa.
- Após alinhar o template, a API foi reiniciada e o login da equipe retornou corretamente à rota protegida no navegador, com o AdminLayout e os endereços de edição oficiais.
