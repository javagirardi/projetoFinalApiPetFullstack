import { mkdir, readFile, writeFile } from "node:fs/promises";
const dir = new URL("../docs/avaliacao/", import.meta.url);
await mkdir(dir, { recursive: true });
let publicado = null;
try { publicado = JSON.parse(await readFile(new URL("trello-publicado.json", dir), "utf8")); }
catch (error) { if (error.code !== "ENOENT") throw error; }
const criadoNoServico = Boolean(publicado?.quadro?.url);

const prConsolidacao = "https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1";
const listas = ["Product Backlog", "Sprint Backlog", "Em andamento", "Em revisão (Pull Request aberto)", "Concluído"];
const requisito = (numero, titulo, modulo, criterios, evidencias) => ({
  id: numero, titulo: `${numero} ${titulo}`, lista: "Concluído", etiquetas: [modulo], responsavel: "proprietario_do_quadro",
  descricao: `Trabalho individual. Implementação integrada na develop pelo PR #1 em 18/10/2026. Conferência do documento e código realizada; 36 testes e build aprovados. PR: ${prConsolidacao}\nEscopo funcional: somente módulos 2 e 3. Limites de navegação em docs/CONTRATOS.md.\nEvidências: ${evidencias.join("; ")}.\nA separação dos commits por requisito foi organizada posteriormente; veja docs/avaliacao/HISTORICO_REQUISITOS.md.`,
  checklist: [
    ...criterios.map((nome) => ({ nome, concluido: true })),
    { nome: "Vincular o cartão ao PR #1 de implementação", concluido: true },
    { nome: "Conferir o documento, o código, os testes e o build", concluido: true },
    { nome: "Integrar por merge na develop antes de mover para Concluído", concluido: true },
  ], pr: prConsolidacao,
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
  { id: "G1", titulo: "G1 Git Flow e revisão (3,0 pontos)", lista: "Em andamento", etiquetas: ["Geral"], responsavel: "proprietario_do_quadro", descricao: "Destino único: https://github.com/javagirardi/projetoFinalApiPetFullstack. PR #1 integrado na develop em 18/10/2026. Histórico reorganizado posteriormente em commits da base e dos requisitos 2.1–3.4, sem alterar o código final. O PR original continua sendo a integração consolidada; não existem PRs anteriores por requisito. PR final develop → main pendente. Estado real em DESTINOS_GITHUB.md e HISTORICO_REQUISITOS.md.", checklist: [
    { nome: "Conferir publicação e branches do repositório pessoal", concluido: true },
    { nome: "Documentar a referência oficial e preservar main/develop", concluido: true },
    { nome: "Organizar commits por requisito com mensagens claras", concluido: true },
    { nome: "Integrar implementação na develop pelo PR #1", concluido: true },
    { nome: "Vincular os cartões reais ao PR de implementação", concluido: criadoNoServico },
    { nome: "PR final develop → main, sem commits diretos em main", concluido: false },
  ] },
  { id: "G2", titulo: "G2 Trello e Scrum individual (1,0 ponto)", lista: criadoNoServico ? "Em andamento" : "Sprint Backlog", etiquetas: ["Geral"], responsavel: "proprietario_do_quadro", descricao: `Quadro solicitado: Lab365PetAmigo. ${criadoNoServico ? `Quadro criado: ${publicado.quadro.url}.` : "Criação no serviço aguarda login na aba desta conversa."} Professor será adicionado posteriormente, por orientação do usuário em 18/10/2026. Trabalho individual, sem participantes ou cerimônias presumidos.`, checklist: [
    { nome: "Criar o quadro com as cinco listas e atribuir os cartões a si", concluido: criadoNoServico },
    { nome: "Adicionar o professor como membro quando sua identificação for fornecida", concluido: Boolean(publicado?.professor_adicionado) },
    { nome: "Registrar meta, planejamento e movimentações reais da sprint", concluido: criadoNoServico },
    { nome: "Registrar daily de até 15 minutos nos dias de aula que ocorrerem", concluido: false },
    { nome: "Registrar revisão e retrospectiva com os fatos da sprint", concluido: false },
    { nome: "Mover os requisitos para Concluído somente após merge na develop", concluido: criadoNoServico },
  ] },
  { id: "SPRINT-1", titulo: "Sprint 1 — módulos 2 e 3", lista: "Sprint Backlog", etiquetas: ["Geral"], responsavel: "proprietario_do_quadro", descricao: "Planejamento proposto em 17/10/2026, sem afirmar início ou cerimônias anteriores. Janela de duas semanas: 17 a 30/10/2026. A entrega avaliativa é antecipada em 19/10/2026 às 23h55; não pode esperar o fim da sprint. Meta: validar módulos 2/3, conferência oficial, revisão e preparação da entrega. Registrar resultados reais; confirmar a adaptação do Scrum para trabalho individual com o professor.", checklist: ["Registrar planejamento e meta", "Revisar evidências e pendências antes de 19/10", "Conferir atividade correta no AVA e enviar dentro do prazo", "Apresentação individual de até 5 minutos, salvo orientação diferente", "Registrar revisão e retrospectiva com fatos e pendências"].map((nome) => ({ nome, concluido: false })) },
  { id: "CONTATO", titulo: "Contato WhatsApp e termo demonstrativo", lista: "Concluído", etiquetas: ["Módulo 2"], responsavel: "proprietario_do_quadro", descricao: `Contato autorizado configurado no ambiente local e no exemplo. Link contextual por pedido ativo, sem envio automático de mensagens. Termo lorem ipsum identificado e autorizado. Integrado na develop pelo PR #1 em 18/10/2026. PR: ${prConsolidacao}`, checklist: [{ nome: "Manter termo demonstrativo identificado", concluido: true }, { nome: "Configurar contato autorizado e conferir destino/mensagem dos links", concluido: true }, { nome: "Conferir e integrar em develop pelo PR #1", concluido: true }], pr: prConsolidacao },
];
for (const card of cards) {
  const registro = publicado?.cartoes?.[card.id];
  if (!registro) continue;
  card.url = registro.url;
  card.lista = registro.lista;
  card.responsavel = registro.responsavel;
  card.checklist = card.checklist.map((item) => ({ ...item,
    concluido: registro.checklist?.find((salvo) => salvo.nome === item.nome)?.concluido ?? item.concluido,
  }));
}
const board = { nome: "Lab365PetAmigo", criado_no_servico: criadoNoServico, url: publicado?.quadro?.url || null, visibilidade_proposta: "public", observacao_visibilidade: "O exemplo do anexo usa Público. Publicar apenas requisitos e links; nunca credenciais, arquivos .env ou dados pessoais.", trabalho: "individual", escopo: [2, 3], timezone: "America/Sao_Paulo", prazo_avaliacao: "2026-10-19T23:55:00-03:00", listas, etiquetas: [{ nome: "Módulo 2", cor: "blue" }, { nome: "Módulo 3", cor: "green" }, { nome: "Geral", cor: "purple" }], cards };
board.acompanhamentos = publicado?.acompanhamentos || [];
await writeFile(new URL("trello.json", dir), JSON.stringify(board, null, 2) + "\n");
let md = "# Quadro Lab365PetAmigo\n\n" + (criadoNoServico ? `Quadro publicado: ${publicado.quadro.url}. Os endereços reais dos cartões estão registrados abaixo.\n\n` : "Ainda não criado no Trello: aguardando login na aba desta conversa. Este arquivo e trello.json descrevem o quadro a criar, sem comprovar ações no serviço.\n\n") + "Trabalho individual. Escopo: módulos 2 e 3. Professor será adicionado posteriormente. Listas: " + listas.join(" → ") + ".\n\n";
if (board.acompanhamentos.length) {
  md += "## Acompanhamento registrado no serviço\n\n";
  for (const registro of board.acompanhamentos) md += `- ${registro.data}: [${registro.tipo}](${registro.url}). ${registro.resumo}\n`;
  md += "\nA sprint está Em andamento. Os critérios de encerramento permanecem pendentes; os registros acima são parciais.\n\n";
}
for (const card of cards) md += `## ${card.titulo}\n\nLista: ${card.lista}. Responsável: ${publicado?.responsavel?.nome || "proprietário do quadro"}. Etiquetas: ${card.etiquetas.join(", ")}.${card.url ? ` Cartão: ${card.url}.` : ""}\n\n${card.descricao}\n\n${card.checklist.map((i) => `- [${i.concluido ? "x" : " "}] ${i.nome}`).join("\n")}\n\n`;
await writeFile(new URL("TRELLO.md", dir), md.trimEnd() + "\n");
console.log(`Especificação local atualizada: ${listas.length} listas e ${cards.length} cartões. Quadro publicado: ${criadoNoServico ? "sim" : "não"}. Esta execução não acessa o Trello.`);
