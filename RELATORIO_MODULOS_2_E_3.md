# Relatório de requisitos e implementação — módulos 2 e 3

Data da análise: 17/10/2026.

Fonte principal: `C:/Users/javan/Downloads/Desenvolvimento Web [FullStack] v1 - Módulo 4 - Projeto Avaliativo.md`, incluindo suas quatro imagens incorporadas.

Este documento registra a análise anterior à implementação. O progresso atual está em `docs/BASE_PROVISORIA.md`. A orientação oficial recebida fora do anexo restringe a entrega aos módulos 2 e 3, sem manter telas vazias ou tarefas de funcionalidades adicionais. As recomendações técnicas abaixo estão identificadas como propostas; os requisitos vêm do enunciado. O conteúdo do anexo foi tratado como material de especificação, respeitando o pedido de analisar antes de implementar.

## 1. Parecer geral

O escopo funcional é composto pelos requisitos 2.1 a 2.3 e 3.1 a 3.4: autenticação, cadastro público de lar adotivo, acompanhamento das próprias adoções e gerenciamento de pets pela equipe. As regras gerais de tecnologia, organização do repositório, Git, Trello, entrega e apresentação também precisam ser cumpridas.

Há uma base aproveitável, principalmente no backend com Express, TypeORM e PostgreSQL. Porém, a etapa exige adequação de contratos, autenticação, entidades e interface. O painel React atual ainda consome outra API, baseada em CPF e dados JSON. Portanto, não basta acrescentar algumas telas ou renomear rotas.

O escopo oficial limita a implementação aos requisitos 2.1–2.3 e 3.1–3.4. Referências a destinos de navegação exigidas nesses requisitos não ampliam a implementação para outras telas.

## 2. Diagnóstico do projeto atual

| Área | Evidência local | Diferença para a nova etapa |
| --- | --- | --- |
| Estrutura | `api_pets_equipe_7/`, `senai_projeto_site_pets-main/` e `servidor_api_pets/` | O enunciado exige um repositório com `frontend/` e `backend/`. É preciso definir a base oficial e reorganizar sem perder o trabalho anterior. |
| Frontend | Site público em HTML/JS e painel em `senai_projeto_site_pets-main/admin/` | A aplicação pedida utiliza React, Vite e React Router com o template fornecido. O React atual cobre apenas parte do painel. |
| Integração | Painel usa `/api/users/login`, `/api/admin/pets` e `/api/pets`, com proxy para a porta 3000 | O backend TypeORM usa `/auth/login`, `/pets` etc., e configura a porta padrão 8888. É necessário unificar endereço, rotas e payloads. |
| Login | Tela pede CPF; backend TypeORM autentica apenas a entidade `Usuario` | Deve pedir e-mail e senha, aceitar equipe e lar e retornar `id`, `nome`, `email` e `role`, além do token. Atualmente retorna `perfil`. |
| Sessão | `App.jsx` verifica apenas se existe `adminUser` no localStorage | É preciso armazenar token e usuário, proteger por perfil, tratar sessão inválida e preservar o destino original. |
| Senhas | `src/utils/auth.js` usa SHA-256 | O cadastro do lar exige bcrypt. O login e os dados de teste devem acompanhar essa mudança. |
| Lar adotivo | Entidade e rotas antigas usam `/lares`, `tipo` e `possui_telas_protecao` | Faltam e-mail, senha, número do endereço, moradia, moradores e outros animais; o novo cadastro é público em `/lares-adotivos`. |
| Adoções | Há entidades de pedido e histórico, com nomes de status da etapa anterior | Faltam as respostas do formulário e a consulta `/minhas-adocoes`; os status precisam seguir o contrato novo. |
| Pets | Cadastro, listagem e atualização já existem parcialmente | Faltam situação calculada, contagem de pedidos, `adotado_por`, consultas auxiliares públicas e detalhe administrativo específico. |
| Arquivamento | Há `DELETE /pets/:id` com soft delete em `deletado_em` | A especificação exige arquivar/restaurar com motivo, sem ocultar os registros dos históricos e da consulta administrativa. |
| Validação de pets | Middleware valida parte dos campos | Faltam limites, aceitação de `null`, bloqueio de idade negativa e rejeição de atualização vazia. A atualização também pode atribuir `null` às relações não enviadas. |
| Git | Não foi encontrado repositório Git na raiz nem diretório `.git` nas três pastas principais verificadas | Não foi possível comprovar branches, commits, remotes ou PRs. Isso precisa ser regularizado ou verificado no checkout oficial. |

O backend já possui `.gitignore` com `.env` e `.env.example`. Isso é uma base adequada, mas não comprova que segredos nunca tenham sido enviados a um repositório remoto.

## 3. Módulo 2 — requisitos e abordagem

### 2.1 Login

**Obrigatório:**

- Tela única para equipe e lares, com e-mail e senha, consumindo `POST /auth/login`.
- Salvar token e usuário (`id`, `nome`, `email`, `role`) no localStorage e mostrar a mensagem da API quando houver falha.
- Sem destino anterior, encaminhar o lar para a listagem pública de pets e a equipe para o painel de processos.
- Preservar a origem quando o acesso começou em uma rota protegida.
- Quando a origem for o botão de adoção, retornar ao mesmo pet com o formulário de pedido aberto.
- Disponibilizar o link “Não sou cadastrado” para o cadastro do lar.

**Como implementar — proposta:** centralizar a sessão e as chamadas HTTP; adaptar a autenticação para consultar equipe e lar, validar suas senhas e identificar o perfil no token. Adotar um contrato único de `role` compatível com o template e com os demais módulos. O ID do lar deve vir da sessão validada pelo backend, evitando confusão entre IDs iguais nas duas tabelas.

Usar proteção de rotas por perfil no React e middleware de autenticação/autorização no Express. Transportar o destino e a intenção de abrir o pedido durante todo o fluxo pet → login → cadastro → login → pet. Aceitar apenas destinos internos compatíveis com o perfil. Ao receber 401 por sessão expirada ou inválida, limpar a sessão e retornar ao login preservando o destino quando aplicável.

### 2.2 Cadastro de lar adotivo

**Obrigatório:** criar formulário público e `POST /lares-adotivos`, com os campos e validações abaixo.

| Campo | Validação exigida |
| --- | --- |
| `nome` | Entre 3 e 100 caracteres |
| `email` | E-mail válido; não pode estar em uso por lar nem equipe |
| `telefone` | Formato `(85) 99999-9999`, com máscara no frontend |
| `cep` | Formato `00000-000`, com máscara no frontend |
| `rua`, `numero`, `bairro`, `cidade` | Obrigatórios |
| `estado` | UF válida |
| `moradia` | `CASA`, `CASA_QUINTAL` ou `APARTAMENTO` |
| `moradores` | Inteiro maior ou igual a 1 |
| `outros_animais` | Booleano verdadeiro ou falso |
| `senha` | Pelo menos 6 caracteres; persistir com bcrypt |
| Confirmação de senha e termo | Conferir somente no frontend; não enviar à API |

Consultar o ViaCEP ao informar um CEP completo e preencher rua, bairro, cidade e estado. Como tratamento técnico recomendado, apresentar falhas ou CEP inexistente, permitir preenchimento manual e impedir que uma resposta atrasada sobrescreva um CEP mais recente.

O backend deve retornar 400 com erros identificáveis por campo, 409 para e-mail já usado e 201 com o lar criado sem senha ou hash. O frontend mostra erros junto aos campos e o conflito de e-mail no topo.

O cadastro **não autentica automaticamente**. Após o sucesso, abrir o login com aviso e e-mail preenchido, mantendo a origem de adoção quando existir. Incluir “Já tenho cadastro”.

**Como implementar — proposta:** ajustar entidade, validação e rota; normalizar e-mail de forma consistente; consultar ambas as tabelas para a duplicidade; retornar apenas campos permitidos. Planejar a alteração dos dados existentes, pois não é possível converter hashes SHA-256 em bcrypt sem conhecer a senha original. Para dados de demonstração, atualizar o seed ou redefinir as senhas.

### 2.3 Minhas adoções

**Obrigatório:** criar tela exclusiva do lar e `GET /minhas-adocoes`. Sem autenticação: 401. Equipe autenticada: 403.

O backend filtra pelo lar identificado no token, carrega `pet`, `pet.raca` e `historico`, ordena os pedidos por `atualizado_em DESC` e cada histórico do mais antigo para o mais recente. A resposta inclui número/ID, status, datas, respostas do formulário, dados do pet e etapas com observação e data.

| Grupo | Status | Conteúdo |
| --- | --- | --- |
| Em andamento | `ANALISE`, `ENTREVISTA`, `APROVADA` | Foto, nome, raça, idade, número e data do pedido, status, etapas Análise → Entrevista → Aprovada → Concluída, próximo passo, histórico e links para pet e WhatsApp |
| Pets adotados | `CONCLUIDA` | Foto, nome, raça, idade e data da etapa de conclusão no histórico |
| Pedidos encerrados | `RECUSADA`, `CANCELADA` | Foto, nome, número, motivo da última etapa e data de encerramento |

Não criar cancelamento pelo lar no site: a desistência é tratada com a equipe pelo WhatsApp. Prever carregamento, erro e estado vazio com convite à listagem de pets.

**Como implementar — proposta:** adequar as entidades aos dados da nova adoção e criar uma consulta específica, sem aceitar um ID de lar enviado pelo cliente para decidir o proprietário. Os relacionamentos atuais podem ser reutilizados, adaptando os nomes ao contrato escolhido. Nunca usar uma listagem geral de pedidos filtrada apenas no navegador. Configurar o número oficial de WhatsApp da ONG.

## 4. Módulo 3 — requisitos e abordagem

### 3.1 Listagem administrativa de pets

**Obrigatório:** tela exclusiva da equipe consumindo `GET /pets`, com todos os pets, inclusive adotados e arquivados. Sem token: 401. Lar autenticado: 403.

Cada card deve mostrar foto, nome, raça, idade, porte, situação, quantidade de pedidos em andamento e, quando existir, `adotado_por` com link para o dossiê do lar.

Incluir busca por nome **ou raça**, filtros por tipo e situação, botão de novo cadastro e ações editar e arquivar/restaurar. A visão inicial exclui somente arquivados; pets adotados continuam entre os ativos dessa listagem. O cabeçalho mostra total cadastrado e total arquivado. Tratar carregamento, erro e lista vazia é uma recomendação técnica coerente com as demais telas.

**Como implementar — proposta:** calcular a situação em uma função compartilhada no backend, a partir de arquivamento e adoções. A tabela textual do enunciado leva à seguinte precedência:

1. `ARQUIVADO`: `arquivado_em` preenchido.
2. `ADOTADO`: existe adoção `CONCLUIDA`.
3. `RESERVADO`: existe adoção `APROVADA`.
4. `EM_PROCESSO`: existe pedido `ANALISE` ou `ENTREVISTA`.
5. `DISPONIVEL`: nenhum dos casos anteriores; pedidos recusados/cancelados não o tornam indisponível.

Os identificadores técnicos acima são uma proposta de padronização, a alinhar com o template; os cinco significados são obrigatórios. A quantidade de pedidos em andamento deve considerar `ANALISE`, `ENTREVISTA` e `APROVADA`. `adotado_por` deve derivar do pedido concluído e expor apenas os dados necessários ao card/link.

### 3.2 Cadastro de pet

**Obrigatório:** tela exclusiva da equipe com `POST /pets`. Carregar seletores nas rotas públicas `GET /tipos`, `GET /racas` e `GET /cores`.

| Campo | Regra |
| --- | --- |
| `nome` | Obrigatório, até 100 caracteres |
| `tipo_id`, `raca_id`, `cor_id` | Obrigatórios, referentes a registros existentes |
| `porte` | Obrigatório: `P`, `M` ou `G` |
| `sexo` | `M`, `F` ou `null` |
| `idade_meses` | Inteiro maior ou igual a zero, ou `null` |
| `foto_url` | Texto de até 255 caracteres ou `null`; frontend exige prefixo `http://` ou `https://` quando preenchido |
| `historia`, `comportamento`, `observacoes_extras` | Texto ou `null` |

A imagem incorporada ao enunciado confirma esses nomes de campos. Não existe exigência de upload de arquivo; a foto é informada por URL.

Mostrar prévia da foto e aviso se não carregar. Validar antes do envio e mostrar erros da API por campo. Sem autenticação: 401; lar autenticado: 403; campos inválidos: 400. No sucesso, retornar 201 com tipo, raça, cor e situação Disponível, e voltar à listagem com mensagem de sucesso.

**Como implementar — proposta:** reaproveitar os campos e relacionamentos do backend atual, corrigir a validação de opcionais e enviar IDs em vez dos textos livres usados pelo formulário antigo. O frontend deve converter campo opcional vazio para `null` de forma consistente.

### 3.3 Edição de pet

**Obrigatório:** reaproveitar o formulário do cadastro, carregar dados por `GET /admin/pets/:id` e salvar por `PUT /pets/:id`, ambas exclusivas da equipe. Pets arquivados também podem ser consultados e editados nessa tela.

- Validar somente os campos enviados, com as mesmas regras do cadastro.
- Preservar os campos e relacionamentos omitidos.
- Responder 400 se não houver campos enviados e 404 se o pet não existir.
- Retornar 200 com o pet atualizado; no frontend, voltar à listagem com sucesso.
- Se a carga inicial retornar 404, voltar à listagem.

**Como implementar — proposta:** usar o mesmo componente de formulário com modo de criação/edição e construir explicitamente o conjunto de propriedades alteradas no backend. Corrigir o comportamento atual que pode limpar tipo, raça e cor numa atualização que não os enviou. Manter a consulta administrativa protegida pelo perfil de equipe.

### 3.4 Arquivamento e restauração

**Obrigatório:** preservar pets e históricos. O fluxo da avaliação usa `PATCH /pets/:id/arquivar` com `{ "motivo": "..." }` e `PATCH /pets/:id/restaurar`.

| Operação | Regras e retorno |
| --- | --- |
| Arquivar | 400 se o motivo estiver ausente ou superar 255 caracteres; 404 se não existir; 409 se já arquivado, com pedido ativo ou adotado; 200 ao preencher `arquivado_em` e `motivo_arquivamento` |
| Restaurar | Limpar os dois campos; retornar 200 com o pet, ou 409 se não estiver arquivado |

Para restauração, aplicar também autenticação de equipe e tratamento de pet inexistente, por coerência com a operação administrativa. Esses detalhes não estão repetidos explicitamente no parágrafo específico da restauração.

Na listagem, “Arquivar” abre o campo de motivo dentro do card. Desativar a ação para pet com pedido ativo ou adotado e explicar o impedimento. O filtro de arquivados mostra data, motivo e botão de restauração.

Arquivar deve retirar o pet da vitrine e impedir novos pedidos, preservando sua presença em históricos, dossiês e “Minhas adoções”. As rotas públicas citadas pelo enunciado não são implementadas nesta entrega restrita; o arquivamento, a consulta administrativa e a preservação dos históricos permanecem obrigatórios.

**Como implementar — proposta:** usar campos próprios de arquivamento, sem marcar o registro com o soft delete atual do TypeORM. Caso haja dados previamente excluídos, definir sua migração explicitamente. Validar elegibilidade e gravar de forma consistente, considerando pedidos criados ou atualizados simultaneamente. Não oferecer o `DELETE` antigo como ação de exclusão da nova interface.

## 5. Mapa de endpoints do nosso escopo

| Método e rota | Acesso | Trabalho necessário |
| --- | --- | --- |
| `POST /auth/login` | Público | Adaptar para equipe e lar, com sessão no contrato novo |
| `POST /lares-adotivos` | Público | Criar cadastro novo, validações, bcrypt e conflito de e-mail |
| `GET /minhas-adocoes` | Lar | Criar consulta isolada pelo token e histórico ordenado |
| `GET /pets` | Equipe | Adaptar para todos os pets, situação e dados derivados |
| `GET /tipos` | Público | Criar listagem auxiliar |
| `GET /racas` | Público | Criar listagem auxiliar |
| `GET /cores` | Público | Criar listagem auxiliar |
| `POST /pets` | Equipe | Adequar validação e resposta |
| `GET /admin/pets/:id` | Equipe | Criar consulta para edição, inclusive de arquivados |
| `PUT /pets/:id` | Equipe | Corrigir atualização parcial, validação e resposta |
| `PATCH /pets/:id/arquivar` | Equipe | Criar arquivamento com motivo e impedimentos |
| `PATCH /pets/:id/restaurar` | Equipe | Criar restauração |

## 6. Dados e contratos compartilhados

São necessárias adequações coordenadas de schema e dados:

- **LarAdotivo:** acrescentar os campos do cadastro novo, incluindo e-mail e hash de senha, e revisar obrigatoriedades dos campos herdados da etapa anterior.
- **Pet:** acrescentar `arquivado_em` e `motivo_arquivamento`; revisar o uso de `deletado_em` para não ocultar históricos nem impedir a edição de arquivados.
- **Adocao:** armazenar `motivo`, `experiencia` e `tempo_sozinho`, mantendo ligação com pet, lar e histórico. A leitura desses dados é necessária ao requisito 2.3; o seed permite testar os diferentes estados sem criar funcionalidades adicionais.
- **Status:** padronizar `ANALISE`, `ENTREVISTA`, `APROVADA`, `CONCLUIDA`, `RECUSADA` e `CANCELADA`. Avaliar o significado dos registros antigos antes de migrar; não renomear automaticamente status com semântica diferente.
- **AdocaoHistorico:** manter o relacionamento inverso com a adoção e as datas. Alinhar o vínculo de autoria `usuario_id` previsto nos demais módulos.
- **Credenciais:** sincronizar login, bcrypt e seeds; excluir senha/hash de todas as respostas e relacionamentos serializados.
- **Erros:** padronizar respostas de validação com associação clara entre campo e mensagem. Sugestão: `{ "erros": { "nome": "..." } }`, desde que alinhada ao template.

Como recomendação técnica, planejar alterações do banco por migrações ou procedimento documentado, em vez de depender apenas de `synchronize` sobre uma base existente.

## 7. Limite oficial da entrega

Somente os módulos 2 e 3 são implementados. Dados de pedidos e históricos são necessários às consultas e às regras desses requisitos, mas não exigem construir telas de criação ou gestão de processos. Os destinos de navegação exigidos pelo enunciado permanecem contratos, sem páginas vazias adicionais. A adaptação das entradas padrão para uso isolado está registrada em `docs/CONTRATOS.md`.

## 8. Orientações gerais da avaliação

**Tecnologia e estrutura:** React + Vite + React Router; Node.js + Express + TypeORM + PostgreSQL; partir do template disponibilizado; manter `frontend/` e `backend/` no mesmo repositório. Configurações do banco em `.env`, fora do GitHub. Antes de reaproveitar a base antiga, comparar com o template oficial para preservar os contratos e a estrutura esperados.

**Git — 3,0 pontos expressamente indicados:** manter `main` para a versão entregue, sem commits diretos; integrar em `develop`; criar branches `feature/` por funcionalidade e `fix/` por correção, a partir de `develop`; commits pequenos, claros e atribuídos aos integrantes; integração por PR; PR final de `develop` para `main`.

O resumo inicial também pede uma branch por módulo. Para contemplar as duas redações, identificar os módulos nas branches de funcionalidade, por exemplo `feature/modulo-2-login` e `feature/modulo-3-arquivamento`, mantendo o fluxo detalhado por funcionalidade. Confirmar com o professor se ele exige adicionalmente uma branch agregadora para cada módulo.

**Trello/Scrum — 1,0 ponto expressamente indicado:** professor como membro e Product Owner; colunas `Product Backlog`, `Sprint Backlog`, `Em andamento`, `Em revisão (Pull Request aberto)` e `Concluído`; cartões por requisito com número, etiqueta do módulo, responsável, checklist e link do PR. Sprints de duas semanas com cartão “Sprint N” e meta; daily de até 15 minutos nos dias de aula; revisão/retrospectiva registradas; Scrum Master em rodízio. Concluir cartão apenas depois do merge na `develop`.

As imagens mostram um quadro de exemplo público e nomes de colunas diferentes do texto. A proposta é usar os nomes da orientação textual e garantir acesso do professor; confirmar se a visibilidade pública da imagem é obrigatória.

**Entrega:** o arquivo informa envio do link do GitHub no AVA até **19/10/2026 às 23h55** e proíbe submissões fora do prazo ou alterações depois da entrega. A referência ao nome da atividade aparece como “Módulo 3 – Projeto Avaliativo”, semana 08, embora o título do documento seja Módulo 4. Confirmar no AVA o destino correto. O fuso não está explicitado no anexo; conferir o horário exibido no AVA.

**Apresentação:** até 20 minutos por equipe e 5 por membro. Explicar organização das tarefas, uso de Git/GitHub, funcionalidades, maiores dificuldades e melhorias. Preparar demonstração dos módulos 2 e 3 com casos de sucesso e regras de impedimento, respeitando o tempo atribuído pelo professor se uma pessoa apresentar dois módulos.

**Recomendação de documentação:** README com instalação, configuração por `.env.example`, criação/atualização do banco, execução, dados de demonstração, mapa das rotas e responsabilidades. Não é um item explicitamente pontuado no texto recebido, mas facilita a reprodução e a avaliação.

## 9. Inconsistências e pontos a confirmar

1. **Erro no exemplo de situação do pet:** a condição que marca Disponível quando não há pedido concluído também captura pets em análise, entrevista ou aprovados. Ela impede os testes seguintes de classificarem corretamente esses pets. Seguir a tabela de negócio e a precedência proposta na seção 4, não copiar o exemplo literalmente. Há também variação entre `RESERVADA`, Reservado e “EM PROCESSO”.
2. **Checklist e critérios ausentes:** o Trello remete aos critérios de “completo” da seção 5, mas a seção 5 recebida trata da apresentação. O sumário também menciona critérios/plano sem uma seção correspondente completa. Não há informação suficiente para distribuir a pontuação funcional ou afirmar uma nota total. Usar critérios derivados de cada requisito e pedir ao professor a rubrica complementar, se existir.
3. **Título e tarefa no AVA divergem:** confirmar qual atividade recebe a entrega e manter o prazo expresso até orientação diferente.
4. **Branches e colunas têm redações diferentes:** aplicar o fluxo detalhado de Git e o texto das cinco colunas; validar apenas as exigências adicionais ambíguas.
5. **Referências externas:** tentei consultar o template e as páginas de demonstração; não foi possível obter o conteúdo por esta sessão. A comparação técnica se apoia no anexo completo e no código local. A aderência ao template e a conferência visual da demonstração permanecem pendentes.
6. **Informações operacionais:** obter o número oficial de WhatsApp, o conteúdo do termo de adoção responsável e a confirmação da base/repositório oficial. Não inventar esses dados na implementação.

## 10. Ordem recomendada de execução

1. **Preparar a entrega:** localizar o repositório oficial, conferir o template, organizar `frontend/` e `backend/`, configurar `develop`, branches e cartões dos sete requisitos. Registrar pendências do enunciado sem presumir exigências adicionais.
2. **Fixar os contratos:** perfis, token, payloads, erros, status, relações e rotas de navegação; restringir a implementação aos requisitos oficiais dos módulos 2 e 3.
3. **Adequar o banco e a API básica:** cadastro e credenciais do lar, bcrypt, campos de adoção e arquivamento, catálogos e dados de demonstração.
4. **Implementar o módulo 2:** cadastro e login com retorno à origem, controle por perfil e “Minhas adoções”.
5. **Implementar o módulo 3:** listagem com situação, formulário compartilhado de criação/edição, arquivamento e restauração.
6. **Integrar e validar:** executar cenários abaixo, conectar os destinos externos ao nosso escopo e revisar PRs antes do merge.
7. **Fechar a avaliação:** revisar Trello, README e apresentação, integrar `develop` em `main` por PR e enviar o link no AVA antes do limite, respeitando a regra de não alterar após a entrega.

O prazo informado está próximo da data desta análise. A prioridade é resolver contratos e base oficial logo no início, pois eles afetam ambos os módulos e podem gerar retrabalho em todas as telas.

## 11. Critérios de aceite propostos para revisão e testes

Esta checklist foi derivada do enunciado; não substitui uma eventual rubrica adicional do professor.

- [ ] Login de equipe e lar funciona; credenciais incorretas mostram erro; sessão contém token e perfil correto.
- [ ] Acesso anônimo a rotas protegidas retorna 401 e perfil incompatível retorna 403 no backend.
- [ ] Retorno à origem funciona inclusive passando pelo cadastro e reabrindo o pedido do mesmo pet.
- [ ] Cadastro valida todos os campos, máscaras e ViaCEP; e-mail repetido em qualquer perfil retorna 409.
- [ ] Cadastro persiste bcrypt, nunca devolve senha/hash e termina no login com e-mail e aviso de sucesso.
- [ ] Um lar não consegue consultar pedidos de outro; pedidos e históricos respeitam as ordenações exigidas.
- [ ] “Minhas adoções” apresenta os três grupos, datas e motivos corretos, links e estados vazio/carregamento/erro, sem cancelamento pelo site.
- [ ] Os cinco estados do pet são calculados corretamente, inclusive quando só existem pedidos recusados/cancelados ou vários pedidos ativos.
- [ ] Listagem administrativa permite busca por nome/raça, filtros, contagens, edição e link para dossiê; arquivados ficam fora da visão inicial.
- [ ] Catálogos públicos carregam e o cadastro envia IDs e valores previstos, com opcionais nulos e prévia/erro de foto.
- [ ] Validações rejeitam IDs inexistentes, idade negativa/fracionária, limites excedidos e valores fora dos enums.
- [ ] Edição permite arquivados, preserva campos e relações omitidos, rejeita body vazio e trata 404.
- [ ] Arquivamento exige motivo, bloqueia pet com pedido ativo/adotado/já arquivado e preserva o histórico.
- [ ] Restauração limpa os campos, permite retorno à vitrine e trata tentativa sobre pet não arquivado.
- [ ] Nenhuma resposta com relações de lar/equipe expõe senha ou hash.
- [ ] Integrações com vitrine, pedido, painel de processos e dossiê foram verificadas na versão conjunta.
- [ ] Build do frontend e cenários de integração da API passam no ambiente documentado.
- [ ] Git, PRs, Trello e apresentação evidenciam o trabalho conforme as orientações gerais.

## 12. Feedback final

Recomendo reaproveitar a modelagem e o acesso ao PostgreSQL como ponto de partida, depois de conferir o template oficial, e adequar o frontend ao contrato novo. A API JSON e o painel antigo são referências da etapa anterior, não uma integração pronta para esta avaliação.

Os maiores riscos são misturar as duas APIs, autenticar apenas a equipe, manter status antigos, copiar o cálculo incorreto de situação e tratar arquivamento como exclusão. A execução deve começar pela estrutura e pelos contratos compartilhados. Com essas decisões resolvidas, os sete requisitos ficam bem delimitados e podem ser implementados e revisados separadamente, preservando o escopo dos módulos 2 e 3.
