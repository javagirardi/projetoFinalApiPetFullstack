# Quadro Lab365PetAmigo

Quadro publicado: https://trello.com/b/LexKmACW/lab365petamigo. Os endereços reais dos cartões estão registrados abaixo.

Trabalho individual. Escopo: módulos 2 e 3. Professor será adicionado posteriormente. Listas: Product Backlog → Sprint Backlog → Em andamento → Em revisão (Pull Request aberto) → Concluído.

## Acompanhamento registrado no serviço

- 2026-10-18: [Acompanhamento e revisão técnica](https://trello.com/c/kIYwuxMx/11-sprint-1-m%C3%B3dulos-2-e-3#comment-6ad4ea1e711d4b32c67fed1b). Andamento real dos módulos 2 e 3, correção da largura em Full HD, resoluções verificadas, build e pendências de integração/entrega.
- 2026-10-18: [Retrospectiva parcial individual](https://trello.com/c/kIYwuxMx/11-sprint-1-m%C3%B3dulos-2-e-3#comment-6ad4ea3bd091aded54279de2). Resultados, falha na conferência visual anterior e ações de melhoria. Não encerra a sprint nem comprova cerimônias anteriores ou daily de aula.

A sprint está Em andamento. Os critérios de encerramento permanecem pendentes; os registros acima são parciais.

## 2.1 Login e sessão por perfil

Lista: Concluído. Responsável: Javan Moises Girardi. Etiquetas: Módulo 2. Cartão: https://trello.com/c/xxWCb5FY/1-21-login-e-sess%C3%A3o-por-perfil.

Trabalho individual. Implementação integrada na develop pelo PR #1 em 18/10/2026. Conferência do documento e código realizada; 36 testes e build aprovados. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3. Limites de navegação em docs/CONTRATOS.md.
Evidências: backend/src/auth; frontend/src/auth; frontend/src/pages/Login.jsx; backend/test/auth.test.js; shared/test/contracts.test.js.
A separação dos commits por requisito foi organizada posteriormente; veja docs/avaliacao/HISTORICO_REQUISITOS.md.

- [x] Login por e-mail/senha; API retorna sessão plana com role admin/lar
- [x] Persistir somente token e DTO público na chave @dadoslogin
- [x] Proteger rotas e distinguir 401/403; logout e sessão inválida tratados
- [x] Preservar redirectTo e petId entre login/cadastro, conforme requisito 2.1
- [x] Vincular o cartão ao PR #1 de implementação
- [x] Conferir o documento, o código, os testes e o build
- [x] Integrar por merge na develop antes de mover para Concluído

## 2.2 Cadastro do lar adotivo

Lista: Concluído. Responsável: Javan Moises Girardi. Etiquetas: Módulo 2. Cartão: https://trello.com/c/sK2Ttw1m/2-22-cadastro-do-lar-adotivo.

Trabalho individual. Implementação integrada na develop pelo PR #1 em 18/10/2026. Conferência do documento e código realizada; 36 testes e build aprovados. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3. Limites de navegação em docs/CONTRATOS.md.
Evidências: frontend/src/pages/Cadastro.jsx; backend/src/modules/lares.js; shared/src/validation.js; backend/test/modules.test.js.
A separação dos commits por requisito foi organizada posteriormente; veja docs/avaliacao/HISTORICO_REQUISITOS.md.

- [x] Campos, máscaras e ViaCEP com alternativa de endereço manual
- [x] Validação no frontend/API, bcrypt e conflito de e-mail entre perfis
- [x] Confirmar senha/aceite somente no frontend, sem enviar à API
- [x] Retornar ao login sem autenticar, com mensagem, e-mail e origem
- [x] Termo lorem ipsum demonstrativo identificado, conforme solicitado
- [x] Vincular o cartão ao PR #1 de implementação
- [x] Conferir o documento, o código, os testes e o build
- [x] Integrar por merge na develop antes de mover para Concluído

## 2.3 Minhas adoções

Lista: Concluído. Responsável: Javan Moises Girardi. Etiquetas: Módulo 2. Cartão: https://trello.com/c/0XCTf7ZM/3-23-minhas-ado%C3%A7%C3%B5es.

Trabalho individual. Implementação integrada na develop pelo PR #1 em 18/10/2026. Conferência do documento e código realizada; 36 testes e build aprovados. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3. Limites de navegação em docs/CONTRATOS.md.
Evidências: frontend/src/pages/MinhasAdocoes.jsx; backend/src/modules/lares.js; backend/test/modules.test.js.
A separação dos commits por requisito foi organizada posteriormente; veja docs/avaliacao/HISTORICO_REQUISITOS.md.

- [x] Isolar pedidos pelo ID do lar no token; equipe não acessa
- [x] Pedidos recentes primeiro e histórico cronológico
- [x] Três grupos com dados, etapas, respostas, motivos e datas do histórico
- [x] Carregamento, erro, vazio e link para detalhe do pet; sem cancelamento pelo lar
- [x] WhatsApp autorizado configurado com mensagem contextual por pedido ativo
- [x] Vincular o cartão ao PR #1 de implementação
- [x] Conferir o documento, o código, os testes e o build
- [x] Integrar por merge na develop antes de mover para Concluído

## 3.1 Listagem administrativa de pets

Lista: Concluído. Responsável: Javan Moises Girardi. Etiquetas: Módulo 3. Cartão: https://trello.com/c/mF1PplMn/4-31-listagem-administrativa-de-pets.

Trabalho individual. Implementação integrada na develop pelo PR #1 em 18/10/2026. Conferência do documento e código realizada; 36 testes e build aprovados. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3. Limites de navegação em docs/CONTRATOS.md.
Evidências: frontend/src/pages/PetList.jsx; backend/src/modules/pets.js; shared/src/index.js.
A separação dos commits por requisito foi organizada posteriormente; veja docs/avaliacao/HISTORICO_REQUISITOS.md.

- [x] Acesso só da equipe; cards e situação calculada com cinco estados
- [x] Busca por nome/raça; filtros por tipo e situação; arquivados separados
- [x] Contagens, pedidos em andamento e link do adotante para /admin/lares/:id
- [x] Ações de novo cadastro, edição, arquivamento e restauração
- [x] Vincular o cartão ao PR #1 de implementação
- [x] Conferir o documento, o código, os testes e o build
- [x] Integrar por merge na develop antes de mover para Concluído

## 3.2 Cadastro de pet

Lista: Concluído. Responsável: Javan Moises Girardi. Etiquetas: Módulo 3. Cartão: https://trello.com/c/1aU8gS7y/5-32-cadastro-de-pet.

Trabalho individual. Implementação integrada na develop pelo PR #1 em 18/10/2026. Conferência do documento e código realizada; 36 testes e build aprovados. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3. Limites de navegação em docs/CONTRATOS.md.
Evidências: frontend/src/pages/PetForm.jsx; backend/src/modules/pets.js; shared/src/validation.js.
A separação dos commits por requisito foi organizada posteriormente; veja docs/avaliacao/HISTORICO_REQUISITOS.md.

- [x] Catálogos públicos e envio dos IDs de tipo/raça/cor
- [x] Obrigatórios, enums, idade inteira e opcionais nulos validados
- [x] Prévia/erro da foto e erros de cada campo apresentados
- [x] API retorna 201 com relacionamentos/situação; volta à lista com sucesso
- [x] Vincular o cartão ao PR #1 de implementação
- [x] Conferir o documento, o código, os testes e o build
- [x] Integrar por merge na develop antes de mover para Concluído

## 3.3 Edição parcial do pet

Lista: Concluído. Responsável: Javan Moises Girardi. Etiquetas: Módulo 3. Cartão: https://trello.com/c/InQE2Kep/6-33-edi%C3%A7%C3%A3o-parcial-do-pet.

Trabalho individual. Implementação integrada na develop pelo PR #1 em 18/10/2026. Conferência do documento e código realizada; 36 testes e build aprovados. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3. Limites de navegação em docs/CONTRATOS.md.
Evidências: frontend/src/pages/PetForm.jsx; backend/src/modules/pets.js; backend/test/modules.test.js.
A separação dos commits por requisito foi organizada posteriormente; veja docs/avaliacao/HISTORICO_REQUISITOS.md.

- [x] Reutilizar formulário, carregar em GET /admin/pets/:id e tratar 404
- [x] Editar pela rota canônica /admin/pets/:id do template
- [x] PUT preserva campos/relações omitidos e rejeita atualização vazia
- [x] Permitir edição dos arquivados e retornar à lista com sucesso
- [x] Vincular o cartão ao PR #1 de implementação
- [x] Conferir o documento, o código, os testes e o build
- [x] Integrar por merge na develop antes de mover para Concluído

## 3.4 Arquivamento e restauração

Lista: Concluído. Responsável: Javan Moises Girardi. Etiquetas: Módulo 3. Cartão: https://trello.com/c/sSJcfsPo/7-34-arquivamento-e-restaura%C3%A7%C3%A3o.

Trabalho individual. Implementação integrada na develop pelo PR #1 em 18/10/2026. Conferência do documento e código realizada; 36 testes e build aprovados. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3. Limites de navegação em docs/CONTRATOS.md.
Evidências: backend/src/modules/pets.js; frontend/src/pages/PetList.jsx; backend/test/modules.test.js.
A separação dos commits por requisito foi organizada posteriormente; veja docs/avaliacao/HISTORICO_REQUISITOS.md.

- [x] Motivo obrigatório até 255 caracteres, solicitado dentro do card
- [x] Bloquear arquivado, pedido ativo e adotado com mensagem
- [x] Preencher/limpar data e motivo por transação sem excluir histórico
- [x] Preservar situação calculada, pedidos e históricos após arquivamento/restauração
- [x] Vincular o cartão ao PR #1 de implementação
- [x] Conferir o documento, o código, os testes e o build
- [x] Integrar por merge na develop antes de mover para Concluído

## G1 Git Flow e revisão (3,0 pontos)

Lista: Em andamento. Responsável: Javan Moises Girardi. Etiquetas: Geral. Cartão: https://trello.com/c/hF3afsKn/9-g1-git-flow-e-revis%C3%A3o-30-pontos.

Destino único: https://github.com/javagirardi/projetoFinalApiPetFullstack. PR #1 integrado na develop em 18/10/2026. Histórico reorganizado posteriormente em commits da base e dos requisitos 2.1–3.4, sem alterar o código final. O PR original continua sendo a integração consolidada; não existem PRs anteriores por requisito. PR final develop → main pendente. Estado real em DESTINOS_GITHUB.md e HISTORICO_REQUISITOS.md.

- [x] Conferir publicação e branches do repositório pessoal
- [x] Documentar a referência oficial e preservar main/develop
- [x] Organizar commits por requisito com mensagens claras
- [x] Integrar implementação na develop pelo PR #1
- [x] Vincular os cartões reais ao PR de implementação
- [ ] PR final develop → main, sem commits diretos em main

## G2 Trello e Scrum individual (1,0 ponto)

Lista: Em andamento. Responsável: Javan Moises Girardi. Etiquetas: Geral. Cartão: https://trello.com/c/x1KQbdDI/10-g2-trello-e-scrum-individual-10-ponto.

Quadro solicitado: Lab365PetAmigo. Quadro criado: https://trello.com/b/LexKmACW/lab365petamigo. Professor será adicionado posteriormente, por orientação do usuário em 18/10/2026. Trabalho individual, sem participantes ou cerimônias presumidos.

- [x] Criar o quadro com as cinco listas e atribuir os cartões a si
- [ ] Adicionar o professor como membro quando sua identificação for fornecida
- [x] Registrar meta, planejamento e movimentações reais da sprint
- [ ] Registrar daily de até 15 minutos nos dias de aula que ocorrerem
- [ ] Registrar revisão e retrospectiva com os fatos da sprint
- [x] Mover os requisitos para Concluído somente após merge na develop

## Sprint 1 — módulos 2 e 3

Lista: Em andamento. Responsável: Javan Moises Girardi. Etiquetas: Geral. Cartão: https://trello.com/c/kIYwuxMx/11-sprint-1-m%C3%B3dulos-2-e-3.

Planejamento proposto em 17/10/2026, sem afirmar início ou cerimônias anteriores. Janela de duas semanas: 17 a 30/10/2026. A entrega avaliativa é antecipada em 19/10/2026 às 23h55; não pode esperar o fim da sprint. Meta: validar módulos 2/3, conferência oficial, revisão e preparação da entrega. Registrar resultados reais; confirmar a adaptação do Scrum para trabalho individual com o professor.

- [x] Registrar planejamento e meta
- [x] Revisar evidências e pendências antes de 19/10
- [ ] Conferir atividade correta no AVA e enviar dentro do prazo
- [ ] Apresentação individual de até 5 minutos, salvo orientação diferente
- [ ] Registrar revisão e retrospectiva com fatos e pendências

## Contato WhatsApp e termo demonstrativo

Lista: Concluído. Responsável: Javan Moises Girardi. Etiquetas: Módulo 2. Cartão: https://trello.com/c/Oaea0JB2/8-contato-whatsapp-e-termo-demonstrativo.

Contato autorizado configurado no ambiente local e no exemplo. Link contextual por pedido ativo, sem envio automático de mensagens. Termo lorem ipsum identificado e autorizado. Integrado na develop pelo PR #1 em 18/10/2026. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1

- [x] Manter termo demonstrativo identificado
- [x] Configurar contato autorizado e conferir destino/mensagem dos links
- [x] Conferir e integrar em develop pelo PR #1
