# Quadro Lab365PetAmigo — preparação para revisão

Ainda não criado no Trello: falta acesso autenticado. Este arquivo e trello.json são a especificação pronta para publicação, não comprovantes de execução.

Trabalho individual. Escopo: módulos 2 e 3. Listas: Product Backlog → Sprint Backlog → Em andamento → Em revisão (Pull Request aberto) → Concluído.

## 2.1 Login e sessão por perfil

Lista: Em revisão (Pull Request aberto). Responsável: proprietário do quadro. Etiquetas: Módulo 2.

Trabalho individual. Implementação publicada em PR de consolidação em rascunho; aguarda conferência independente e revisão. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3.
Evidências: backend/src/auth; frontend/src/auth; frontend/src/pages/Login.jsx; backend/test/auth.test.js; shared/test/contracts.test.js.

- [x] Login por e-mail/senha; API retorna sessão plana com role admin/lar
- [x] Persistir somente token e DTO público na chave @dadoslogin
- [x] Proteger rotas e distinguir 401/403; logout e sessão inválida tratados
- [x] Preservar redirectTo e petId entre login/cadastro, conforme requisito 2.1
- [x] PR referenciado na especificação local; vincular ao cartão real quando o quadro for criado
- [ ] Revisar o PR e corrigir os apontamentos
- [ ] Integrar por merge na develop antes de mover para Concluído

## 2.2 Cadastro do lar adotivo

Lista: Em revisão (Pull Request aberto). Responsável: proprietário do quadro. Etiquetas: Módulo 2.

Trabalho individual. Implementação publicada em PR de consolidação em rascunho; aguarda conferência independente e revisão. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3.
Evidências: frontend/src/pages/Cadastro.jsx; backend/src/modules/lares.js; shared/src/validation.js; backend/test/modules.test.js.

- [x] Campos, máscaras e ViaCEP com alternativa de endereço manual
- [x] Validação no frontend/API, bcrypt e conflito de e-mail entre perfis
- [x] Confirmar senha/aceite somente no frontend, sem enviar à API
- [x] Retornar ao login sem autenticar, com mensagem, e-mail e origem
- [x] Termo lorem ipsum demonstrativo identificado, conforme solicitado
- [x] PR referenciado na especificação local; vincular ao cartão real quando o quadro for criado
- [ ] Revisar o PR e corrigir os apontamentos
- [ ] Integrar por merge na develop antes de mover para Concluído

## 2.3 Minhas adoções

Lista: Em revisão (Pull Request aberto). Responsável: proprietário do quadro. Etiquetas: Módulo 2.

Trabalho individual. Implementação publicada em PR de consolidação em rascunho; aguarda conferência independente e revisão. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3.
Evidências: frontend/src/pages/MinhasAdocoes.jsx; backend/src/modules/lares.js; backend/test/modules.test.js.

- [x] Isolar pedidos pelo ID do lar no token; equipe não acessa
- [x] Pedidos recentes primeiro e histórico cronológico
- [x] Três grupos com dados, etapas, respostas, motivos e datas do histórico
- [x] Carregamento, erro, vazio e link para detalhe do pet; sem cancelamento pelo lar
- [x] WhatsApp autorizado configurado com mensagem contextual por pedido ativo
- [x] PR referenciado na especificação local; vincular ao cartão real quando o quadro for criado
- [ ] Revisar o PR e corrigir os apontamentos
- [ ] Integrar por merge na develop antes de mover para Concluído

## 3.1 Listagem administrativa de pets

Lista: Em revisão (Pull Request aberto). Responsável: proprietário do quadro. Etiquetas: Módulo 3.

Trabalho individual. Implementação publicada em PR de consolidação em rascunho; aguarda conferência independente e revisão. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3.
Evidências: frontend/src/pages/PetList.jsx; backend/src/modules/pets.js; shared/src/index.js.

- [x] Acesso só da equipe; cards e situação calculada com cinco estados
- [x] Busca por nome/raça; filtros por tipo e situação; arquivados separados
- [x] Contagens, pedidos em andamento e link do adotante para /admin/lares/:id
- [x] Ações de novo cadastro, edição, arquivamento e restauração
- [x] PR referenciado na especificação local; vincular ao cartão real quando o quadro for criado
- [ ] Revisar o PR e corrigir os apontamentos
- [ ] Integrar por merge na develop antes de mover para Concluído

## 3.2 Cadastro de pet

Lista: Em revisão (Pull Request aberto). Responsável: proprietário do quadro. Etiquetas: Módulo 3.

Trabalho individual. Implementação publicada em PR de consolidação em rascunho; aguarda conferência independente e revisão. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3.
Evidências: frontend/src/pages/PetForm.jsx; backend/src/modules/pets.js; shared/src/validation.js.

- [x] Catálogos públicos e envio dos IDs de tipo/raça/cor
- [x] Obrigatórios, enums, idade inteira e opcionais nulos validados
- [x] Prévia/erro da foto e erros de cada campo apresentados
- [x] API retorna 201 com relacionamentos/situação; volta à lista com sucesso
- [x] PR referenciado na especificação local; vincular ao cartão real quando o quadro for criado
- [ ] Revisar o PR e corrigir os apontamentos
- [ ] Integrar por merge na develop antes de mover para Concluído

## 3.3 Edição parcial do pet

Lista: Em revisão (Pull Request aberto). Responsável: proprietário do quadro. Etiquetas: Módulo 3.

Trabalho individual. Implementação publicada em PR de consolidação em rascunho; aguarda conferência independente e revisão. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3.
Evidências: frontend/src/pages/PetForm.jsx; backend/src/modules/pets.js; backend/test/modules.test.js.

- [x] Reutilizar formulário, carregar em GET /admin/pets/:id e tratar 404
- [x] Editar pela rota canônica /admin/pets/:id do template
- [x] PUT preserva campos/relações omitidos e rejeita atualização vazia
- [x] Permitir edição dos arquivados e retornar à lista com sucesso
- [x] PR referenciado na especificação local; vincular ao cartão real quando o quadro for criado
- [ ] Revisar o PR e corrigir os apontamentos
- [ ] Integrar por merge na develop antes de mover para Concluído

## 3.4 Arquivamento e restauração

Lista: Em revisão (Pull Request aberto). Responsável: proprietário do quadro. Etiquetas: Módulo 3.

Trabalho individual. Implementação publicada em PR de consolidação em rascunho; aguarda conferência independente e revisão. PR: https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1
Escopo funcional: somente módulos 2 e 3.
Evidências: backend/src/modules/pets.js; frontend/src/pages/PetList.jsx; backend/test/modules.test.js.

- [x] Motivo obrigatório até 255 caracteres, solicitado dentro do card
- [x] Bloquear arquivado, pedido ativo e adotado com mensagem
- [x] Preencher/limpar data e motivo por transação sem excluir histórico
- [x] Preservar situação calculada, pedidos e históricos após arquivamento/restauração
- [x] PR referenciado na especificação local; vincular ao cartão real quando o quadro for criado
- [ ] Revisar o PR e corrigir os apontamentos
- [ ] Integrar por merge na develop antes de mover para Concluído

## G1 Git Flow e revisão (3,0 pontos)

Lista: Sprint Backlog. Responsável: proprietário do quadro. Etiquetas: Geral.

Destino único autorizado: https://github.com/javagirardi/projetoFinalApiPetFullstack. Conta autenticada e repositório pessoal criado. Branch de consolidação feature/modulos-2-e-3 a partir do template oficial. PR de consolidação #1 aberto em rascunho para develop. Conferir os links e o estado real em DESTINOS_GITHUB.md; não simular histórico retroativo ou declarar merges pendentes como concluídos.

- [ ] Conferir publicação e branches do repositório pessoal
- [ ] Preservar a referência oficial e preparar develop/main
- [ ] Criar feature/ por funcionalidade e fix/ por correção a partir da develop
- [ ] Commits pequenos por requisito/parte com mensagens claras
- [ ] Integrar em develop somente por PR; linkar cartões
- [ ] PR final develop → main, sem commits diretos em main

## G2 Trello e Scrum individual (1,0 ponto)

Lista: Sprint Backlog. Responsável: proprietário do quadro. Etiquetas: Geral.

Quadro solicitado: Lab365PetAmigo. Ainda não criado no serviço: falta acesso autenticado. Professor como Product Owner; trabalho individual informado pelo usuário. Não inventar participantes, reuniões ou rodízios.

- [ ] Criar o quadro com as cinco listas e atribuir os cartões a si
- [ ] Adicionar o professor como membro após obter sua identificação e autorização de convite
- [ ] Registrar meta, planejamento e movimentações reais da sprint
- [ ] Registrar daily de até 15 minutos nos dias de aula que ocorrerem
- [ ] Registrar revisão/retrospectiva real, sem retroagir datas
- [ ] Mover para Concluído somente após merge na develop

## Sprint 1 — módulos 2 e 3

Lista: Sprint Backlog. Responsável: proprietário do quadro. Etiquetas: Geral.

Planejamento proposto em 17/10/2026, sem afirmar início ou cerimônias anteriores. Janela de duas semanas: 17 a 30/10/2026. A entrega avaliativa é antecipada em 19/10/2026 às 23h55; não pode esperar o fim da sprint. Meta: validar módulos 2/3, conferência oficial, revisão e preparação da entrega. Registrar resultados reais; confirmar a adaptação do Scrum para trabalho individual com o professor.

- [ ] Registrar planejamento e meta
- [ ] Revisar evidências e pendências antes de 19/10
- [ ] Conferir atividade correta no AVA e enviar dentro do prazo
- [ ] Apresentação individual de até 5 minutos, salvo orientação diferente
- [ ] Registrar revisão e retrospectiva com fatos e pendências

## Contato WhatsApp e termo demonstrativo

Lista: Em andamento. Responsável: proprietário do quadro. Etiquetas: Módulo 2.

Contato autorizado pelo usuário configurado no ambiente local e no exemplo de configuração. Link contextual por pedido ativo, sem envio automático de mensagens. Termo lorem ipsum identificado e autorizado. Aguarda PR/revisão/merge.

- [x] Manter termo demonstrativo identificado
- [x] Configurar contato autorizado e conferir destino/mensagem dos links
- [ ] Linkar PR, revisar e integrar em develop
