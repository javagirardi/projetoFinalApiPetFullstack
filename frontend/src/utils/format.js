export const data = (valor) => valor ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(valor)) : "Não informada";
export function idade(meses) {
  if (meses == null) return "Idade não informada";
  if (meses < 12) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  const anos = Math.floor(meses / 12), resto = meses % 12;
  return `${anos} ${anos === 1 ? "ano" : "anos"}${resto ? ` e ${resto} ${resto === 1 ? "mês" : "meses"}` : ""}`;
}
export const labelsSituacao = { DISPONIVEL: "Disponível", EM_PROCESSO: "Em processo", RESERVADO: "Reservado", ADOTADO: "Adotado", ARQUIVADO: "Arquivado" };
export const labelsStatus = { ANALISE: "Em análise", ENTREVISTA: "Entrevista agendada", APROVADA: "Aprovada", CONCLUIDA: "Concluída", RECUSADA: "Recusada", CANCELADA: "Cancelada" };
export const labelsPorte = { P: "Pequeno", M: "Médio", G: "Grande" };
export function mascaraCep(valor) { return valor.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"); }
export function mascaraTelefone(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}${d.length > 7 ? `-${d.slice(7)}` : ""}`;
}
