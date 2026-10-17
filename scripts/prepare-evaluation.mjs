import { mkdir, writeFile } from "node:fs/promises";
const dir = new URL("../docs/avaliacao/", import.meta.url);
await mkdir(dir, { recursive: true });

const listas = ["Product Backlog", "Sprint Backlog", "Em andamento", "Em revisão (Pull Request aberto)", "Concluído"];
const requisito = (numero, titulo, modulo, criterios, evidencias) => ({
  id: numero, titulo: `${numero} ${titulo}`, lista: "Em andamento", etiquetas: [modulo], responsavel: "proprietario_do_quadro",
  descricao: `Trabalho individual. Implementação local disponível; aguarda organização do histórico Git, PR e revisão.\nEscopo funcional: somente módulos 2 e 3.\nEvidências: ${evidencias.join("; ")}.`,
  checklist: [
    ...criterios.map((nome) => ({ nome, concluido: true })),
    { nome: "Linkar o PR deste requisito ao cartão", concluido: false },
    { nome: "Revisar o PR e corrigir os apontamentos", concluido: false },
    { nome: "Integrar por merge na develop antes de mover para Concluído", concluido: false },
  ], pr: null,
});
const cards = [
  requisito("2.1", "Login e sessão por perfil", "Módulo 2", [
    "Login por e-mail/senha; API retorna sessão plana com role admin/lar",
    "Persistir somente token e DTO público na chave @dadoslogin",
    "Proteger rotas e distinguir 401/403; logout e sessão inválida tratados",
    "Preservar redirectTo e petId entre login/cadastro, conforme requisito 2.1",
  ], ["backend/src/auth", "frontend/src/auth", "frontend/src/pages/Login.jsx", "backend/test/auth.test.js", "shared/test/contracts.test.js"]),
  requisito("2.2", "Cadastro do lar adotivo", "Módulo 2", [
    "Campos, máscaras e ViaCEP com alternativa de endereço manual",
    "Validação no frontend/API, bcrypt e conflito de e-mail entre perfis",
    "Confirmar senha/aceite somente no frontend, sem enviar à API",
    "Retornar ao login sem autenticar, com mensagem, e-mail e origem",
    "Termo lorem ipsum demonstrativo identificado, conforme solicitado",
  ], ["frontend/src/pages/Cadastro.jsx", "backend/src/modules/lares.js", "shared/src/validation.js", "backend/test/modules.test.js"]),
  requisito("2.3", "Minhas adoções", "Módulo 2", [
    "Isolar pedidos pelo ID do lar no token; equipe não acessa",
    "Pedidos recentes primeiro e histórico cronológico",
    "Três grupos com dados, etapas, respostas, motivos e datas do histórico",
    "Carregamento, erro, vazio e link para detalhe do pet; sem cancelamento pelo lar",
    "WhatsApp autorizado configurado com mensagem contextual por pedido ativo",
  ], ["frontend/src/pages/MinhasAdocoes.jsx", "backend/src/modules/lares.js", "backend/test/modules.test.js"]),
  requisito("3.1", "Listagem administrativa de pets", "Módulo 3", [
    "Acesso só da equipe; cards e situação calculada com cinco estados",
    "Busca por nome/raça; filtros por tipo e situação; arquivados separados",
    "Contagens, pedidos em andamento e link do adotante para /admin/lares/:id",
    "Ações de novo cadastro, edição, arquivamento e restauração",
  ], ["frontend/src/pages/PetList.jsx", "backend/src/modules/pets.js", "shared/src/index.js"]),
  requisito("3.2", "Cadastro de pet", "Módulo 3", [
    "Catálogos públicos e envio dos IDs de tipo/raça/cor",
    "Obrigatórios, enums, idade inteira e opcionais nulos validados",
    "Prévia/erro da foto e erros de cada campo apresentados",
    "API retorna 201 com relacionamentos/situação; volta à lista com sucesso",
  ], ["frontend/src/pages/PetForm.jsx", "backend/src/modules/pets.js", "shared/src/validation.js"]),
  requisito("3.3", "Edição parcial do pet", "Módulo 3", [
    "Reutilizar formulário, carregar em GET /admin/pets/:id e tratar 404",
    "Editar pela rota canônica /admin/pets/:id do template",
    "PUT preserva campos/relações omitidos e rejeita atualização vazia",
    "Permitir edição dos arquivados e retornar à lista com sucesso",
  ], ["frontend/src/pages/PetForm.jsx", "backend/src/modules/pets.js", "backend/test/modules.test.js"]),
  requisito("3.4", "Arquivamento e restauração", "Módulo 3", [
    "Motivo obrigatório até 255 caracteres, solicitado dentro do card",
    "Bloquear arquivado, pedido ativo e adotado com mensagem",
    "Preencher/limpar data e motivo por transação sem excluir histórico",
    "Preservar situação calculada, pedidos e históricos após arquivamento/restauração",
  ], ["backend/src/modules/pets.js", "frontend/src/pages/PetList.jsx", "backend/test/modules.test.js"]),
  { id: "G1", titulo: "G1 Git Flow e revisão (3,0 pontos)", lista: "Sprint Backlog", etiquetas: ["Geral"], responsavel: "proprietario_do_quadro", descricao: "Destino único autorizado: https://github.com/javagirardi/projetoFinalApiPetFullstack. Conta autenticada e repositório pessoal criado. Branch de consolidação feature/modulos-2-e-3 a partir do template oficial. Conferir os links e o estado real em DESTINOS_GITHUB.md; não simular histórico retroativo ou declarar merges pendentes como concluídos.", checklist: ["Conferir publicação e branches do repositório pessoal", "Preservar a referência oficial e preparar develop/main", "Criar feature/ por funcionalidade e fix/ por correção a partir da develop", "Commits pequenos por requisito/parte com mensagens claras", "Integrar em develop somente por PR; linkar cartões", "PR final develop → main, sem commits diretos em main"].map((nome) => ({ nome, concluido: false })) },
  { id: "G2", titulo: "G2 Trello e Scrum individual (1,0 ponto)", lista: "Sprint Backlog", etiquetas: ["Geral"], responsavel: "proprietario_do_quadro", descricao: "Quadro solicitado: Lab365PetAmigo. Ainda não criado no serviço: falta acesso autenticado. Professor como Product Owner; trabalho individual informado pelo usuário. Não inventar participantes, reuniões ou rodízios.", checklist: ["Criar o quadro com as cinco listas e atribuir os cartões a si", "Adicionar o professor como membro após obter sua identificação e autorização de convite", "Registrar meta, planejamento e movimentações reais da sprint", "Registrar daily de até 15 minutos nos dias de aula que ocorrerem", "Registrar revisão/retrospectiva real, sem retroagir datas", "Mover para Concluído somente após merge na develop"].map((nome) => ({ nome, concluido: false })) },
  { id: "SPRINT-1", titulo: "Sprint 1 — módulos 2 e 3", lista: "Sprint Backlog", etiquetas: ["Geral"], responsavel: "proprietario_do_quadro", descricao: "Planejamento proposto em 17/10/2026, sem afirmar início ou cerimônias anteriores. Janela de duas semanas: 17 a 30/10/2026. A entrega avaliativa é antecipada em 19/10/2026 às 23h55; não pode esperar o fim da sprint. Meta: validar módulos 2/3, conferência oficial, revisão e preparação da entrega. Registrar resultados reais; confirmar a adaptação do Scrum para trabalho individual com o professor.", checklist: ["Registrar planejamento e meta", "Revisar evidências e pendências antes de 19/10", "Conferir atividade correta no AVA e enviar dentro do prazo", "Apresentação individual de até 5 minutos, salvo orientação diferente", "Registrar revisão e retrospectiva com fatos e pendências"].map((nome) => ({ nome, concluido: false })) },
  { id: "CONTATO", titulo: "Contato WhatsApp e termo demonstrativo", lista: "Em andamento", etiquetas: ["Módulo 2"], responsavel: "proprietario_do_quadro", descricao: "Contato autorizado pelo usuário configurado no ambiente local e no exemplo de configuração. Link contextual por pedido ativo, sem envio automático de mensagens. Termo lorem ipsum identificado e autorizado. Aguarda PR/revisão/merge.", checklist: [{ nome: "Manter termo demonstrativo identificado", concluido: true }, { nome: "Configurar contato autorizado e conferir destino/mensagem dos links", concluido: true }, { nome: "Linkar PR, revisar e integrar em develop", concluido: false }] },
];
const board = { nome: "Lab365PetAmigo", criado_no_servico: false, visibilidade_proposta: "public", observacao_visibilidade: "O exemplo do anexo usa Público. Publicar apenas requisitos e links; nunca credenciais, arquivos .env ou dados pessoais.", trabalho: "individual", escopo: [2, 3], timezone: "America/Sao_Paulo", prazo_avaliacao: "2026-10-19T23:55:00-03:00", listas, etiquetas: [{ nome: "Módulo 2", cor: "blue" }, { nome: "Módulo 3", cor: "green" }, { nome: "Geral", cor: "purple" }], cards };
await writeFile(new URL("trello.json", dir), JSON.stringify(board, null, 2) + "\n");
let md = "# Quadro Lab365PetAmigo — preparação para revisão\n\nAinda não criado no Trello: falta acesso autenticado. Este arquivo e trello.json são a especificação pronta para publicação, não comprovantes de execução.\n\nTrabalho individual. Escopo: módulos 2 e 3. Listas: " + listas.join(" → ") + ".\n\n";
for (const card of cards) md += `## ${card.titulo}\n\nLista: ${card.lista}. Responsável: proprietário do quadro. Etiquetas: ${card.etiquetas.join(", ")}.\n\n${card.descricao}\n\n${card.checklist.map((i) => `- [${i.concluido ? "x" : " "}] ${i.nome}`).join("\n")}\n\n`;
await writeFile(new URL("TRELLO.md", dir), md.trimEnd() + "\n");
console.log(`Quadro Lab365PetAmigo preparado localmente com ${listas.length} listas e ${cards.length} cartões. Nenhuma ação executada no Trello.`);
