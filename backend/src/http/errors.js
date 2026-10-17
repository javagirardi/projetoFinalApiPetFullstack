export class HttpError extends Error {
  constructor(status, mensagem, erros) {
    super(mensagem);
    this.status = status;
    this.erros = erros;
  }
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === "entity.parse.failed") error = new HttpError(400, "JSON inválido.");
  if (error.type === "entity.too.large") error = new HttpError(413, "Corpo da requisição muito grande.");
  const status = error instanceof HttpError ? error.status : 500;
  if (status === 500) console.error("Erro interno:", error.code || error.name);
  return res.status(status).json({
    error: status === 500 ? "Erro interno do servidor." : error.message,
    erro: status === 500 ? "Erro interno do servidor." : error.message,
    ...(error instanceof HttpError && error.erros ? { campos: error.erros, erros: error.erros } : {}),
  });
}
