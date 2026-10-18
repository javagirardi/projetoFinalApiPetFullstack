import { HttpError } from "../http/errors.js";

export const autenticar = (seguranca) => (req, res, next) => {
  const match = /^Bearer ([^\s]+)$/i.exec(req.headers.authorization || "");
  const usuario = match && seguranca.validarToken(match[1]);
  if (!usuario) return next(new HttpError(401, "Sessão inválida ou não informada."));
  req.usuario = usuario;
  return next();
};

export const exigirRole = (...roles) => (req, res, next) => {
  if (!req.usuario) return next(new HttpError(401, "Autenticação necessária."));
  if (!roles.includes(req.usuario.role)) return next(new HttpError(403, "Acesso não permitido para este perfil."));
  return next();
};
