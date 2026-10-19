// Valores públicos do template oficial; nomes das chaves mantêm o domínio legível.
export const ROLE = Object.freeze({ EQUIPE: "admin", LAR: "lar" });
export { validarLar, validarPet, validarMotivo, UNIDADES_FEDERATIVAS } from "./validation.js";
export const STATUS_ADOCAO = Object.freeze({
  ANALISE: "ANALISE", ENTREVISTA: "ENTREVISTA", APROVADA: "APROVADA",
  CONCLUIDA: "CONCLUIDA", RECUSADA: "RECUSADA", CANCELADA: "CANCELADA",
});
export const STATUS_ATIVOS = Object.freeze([
  STATUS_ADOCAO.ANALISE, STATUS_ADOCAO.ENTREVISTA, STATUS_ADOCAO.APROVADA,
]);
export const SITUACAO_PET = Object.freeze({
  DISPONIVEL: "DISPONIVEL", EM_PROCESSO: "EM_PROCESSO", RESERVADO: "RESERVADO",
  ADOTADO: "ADOTADO", ARQUIVADO: "ARQUIVADO",
});
export const MORADIA = Object.freeze({ CASA: "CASA", CASA_QUINTAL: "CASA_QUINTAL", APARTAMENTO: "APARTAMENTO" });
export const PORTE = Object.freeze({ PEQUENO: "P", MEDIO: "M", GRANDE: "G" });
export const SEXO = Object.freeze({ MACHO: "M", FEMEA: "F" });
export const EXPERIENCIA = Object.freeze({ PRIMEIRO: "PRIMEIRO", JA_TEVE: "JA_TEVE", TEM_OUTROS: "TEM_OUTROS" });
export const TEMPO_SOZINHO = Object.freeze({ ATE_4H: "ATE_4H", DE_4_A_8H: "DE_4_A_8H", MAIS_8H: "MAIS_8H" });

export const ROTAS = Object.freeze({
  HOME: "/", LOGIN: "/login", CADASTRO: "/cadastro", PETS: "/pets",
  MINHAS_ADOCOES: "/minhas-adocoes", PROCESSOS: "/admin/processos",
  ADMIN_PETS: "/admin/pets", NOVO_PET: "/admin/pets/novo",
});

export function calcularSituacaoPet({ arquivado_em, adocoes = [] }) {
  if (arquivado_em != null) return SITUACAO_PET.ARQUIVADO;
  const status = new Set(adocoes.map((adocao) => adocao.status));
  if (status.has(STATUS_ADOCAO.CONCLUIDA)) return SITUACAO_PET.ADOTADO;
  if (status.has(STATUS_ADOCAO.APROVADA)) return SITUACAO_PET.RESERVADO;
  if (status.has(STATUS_ADOCAO.ANALISE) || status.has(STATUS_ADOCAO.ENTREVISTA)) return SITUACAO_PET.EM_PROCESSO;
  return SITUACAO_PET.DISPONIVEL;
}

export function contarPedidosEmAndamento(adocoes = []) {
  return adocoes.filter(({ status }) => STATUS_ATIVOS.includes(status)).length;
}

export function usuarioPublico(usuario, role = usuario.role) {
  if (!Object.values(ROLE).includes(role)) throw new TypeError("Perfil inválido.");
  return { id: usuario.id, nome: usuario.nome, email: usuario.email, role };
}

export function sessaoValida(sessao) {
  const usuario = sessao?.usuario || sessao;
  return typeof sessao?.token === "string" && sessao.token.length > 0
    && Number.isSafeInteger(usuario?.id) && usuario.id > 0
    && typeof usuario.nome === "string" && typeof usuario.email === "string"
    && Object.values(ROLE).includes(usuario.role);
}

export function normalizarSessao(sessao) {
  if (!sessaoValida(sessao)) return null;
  return { token: sessao.token, usuario: usuarioPublico(sessao.usuario || sessao) };
}

// O requisito 2.1 preserva { redirectTo, petId } no estado da navegação.
export function contextoAutenticacao(state = {}, search = "") {
  const query = new URLSearchParams(search);
  const candidato = state?.petId ?? query.get("petId");
  const id = candidato == null || candidato === "" ? null : Number(candidato);
  const petId = Number.isSafeInteger(id) && id > 0 && id <= 2147483647 ? id : null;
  const redirectTo = state?.redirectTo || state?.retorno || query.get("retorno") || (petId ? `/pets/${petId}` : undefined);
  return { redirectTo, ...(petId ? { petId } : {}) };
}

export function navegacaoAposLogin(role, contexto) {
  const to = destinoAposLogin(role, contexto?.redirectTo);
  // Só repassar a intenção para a página do mesmo pet e para um lar autenticado.
  const caminho = new URL(to, "https://app.local").pathname;
  const state = role === ROLE.LAR && contexto?.petId && caminho === `/pets/${contexto.petId}` ? { petId: contexto.petId } : undefined;
  return { to, state };
}

export function destinoAposLogin(role, destino) {
  const padrao = role === ROLE.EQUIPE ? ROTAS.PROCESSOS : ROTAS.PETS;
  if (typeof destino !== "string" || !destino.startsWith("/") || destino.startsWith("//")
      || /[\\\s\u0000-\u001f]/u.test(destino)) return padrao;
  let caminho;
  try {
    const url = new URL(destino, "https://app.local");
    if (url.origin !== "https://app.local") return padrao;
    caminho = decodeURIComponent(url.pathname);
  } catch { return padrao; }
  if (caminho.startsWith("//") || caminho.includes("\\")) return padrao;
  if ([ROTAS.LOGIN, ROTAS.CADASTRO].includes(caminho)) return padrao;
  const administrativo = caminho === "/admin" || caminho.startsWith("/admin/");
  if (role === ROLE.LAR && administrativo) return padrao;
  if (role === ROLE.EQUIPE && !administrativo) return padrao;
  return destino;
}
