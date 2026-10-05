// Regras do processo de adoção
//
//   ANALISE -> ENTREVISTA -> APROVADA -> CONCLUIDA (pet entregue)
//          \-> RECUSADA / CANCELADA (a qualquer momento antes de concluir)
//
// O lar faz login e envia o pedido pelo site; daí em diante toda mudança é feita pela equipe e o
// acompanhamento com o adotante é pelo WhatsApp. Se o adotante desistir, o colaborador
// CANCELA o pedido e registra o motivo na observação.

export const STATUS_ADOCAO = {
  ANALISE: "ANALISE",
  ENTREVISTA: "ENTREVISTA",
  APROVADA: "APROVADA",
  CONCLUIDA: "CONCLUIDA",
  RECUSADA: "RECUSADA",
  CANCELADA: "CANCELADA",
};

export const STATUS_ADOCAO_VALIDOS = Object.values(STATUS_ADOCAO);

// pedidos que ainda estão em andamento
export const STATUS_ATIVOS = [
  STATUS_ADOCAO.ANALISE,
  STATUS_ADOCAO.ENTREVISTA,
  STATUS_ADOCAO.APROVADA,
];

// para qual status a equipe pode mover o pedido a partir do status atual
export const TRANSICOES_EQUIPE = {
  ANALISE: [STATUS_ADOCAO.ENTREVISTA, STATUS_ADOCAO.RECUSADA, STATUS_ADOCAO.CANCELADA],
  ENTREVISTA: [STATUS_ADOCAO.APROVADA, STATUS_ADOCAO.RECUSADA, STATUS_ADOCAO.CANCELADA],
  APROVADA: [STATUS_ADOCAO.CONCLUIDA, STATUS_ADOCAO.CANCELADA],
};

// encerrar um pedido exige explicar o motivo na observação
export const STATUS_EXIGEM_MOTIVO = [STATUS_ADOCAO.RECUSADA, STATUS_ADOCAO.CANCELADA];

export const EXPERIENCIAS = ["PRIMEIRO", "JA_TEVE", "TEM_OUTROS"];
export const TEMPOS_SOZINHO = ["ATE_4H", "DE_4_A_8H", "MAIS_8H"];

// situação do pet na vitrine, calculada a partir das adoções (ou ARQUIVADO, se a equipe arquivou o pet)
export const SITUACAO_PET = {
  DISPONIVEL: "DISPONIVEL",
  EM_PROCESSO: "EM_PROCESSO",
  RESERVADO: "RESERVADO",
  ADOTADO: "ADOTADO",
  ARQUIVADO: "ARQUIVADO",
};

export const SITUACOES_PET_VALIDAS = Object.values(SITUACAO_PET);
