import { CONFLICT_STATUS, INTERNAL_SERVER_STATUS } from "../../constants/server.js";

export function errorHandler(error, request, response, next) {
  const status = error.status || INTERNAL_SERVER_STATUS;

  // erros esperados (400, 404, 409...) só registram a mensagem; erros 500 mostram o stack
  if (status >= INTERNAL_SERVER_STATUS) console.error(error);
  else console.log(`[errorHandler] ${status}: ${error.message}`);

  // violação de chave única no PostgreSQL (ex.: e-mail repetido)
  if (error.code === "23505") {
    return response.status(CONFLICT_STATUS).send({ error: "Registro duplicado" });
  }

  response
    .status(status)
    .send({ error: error.message || "Erro interno no servidor" });
}
