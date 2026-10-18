import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { ROLE, usuarioPublico } from "@lab365/contracts";

export function criarSeguranca({ authSecret, authExpiresIn = "8h" }) {
  if (typeof authSecret !== "string" || authSecret.length < 32) throw new Error("Segredo de autenticação inválido.");
  return {
    hashSenha: (senha) => bcrypt.hash(senha, 12),
    compararSenha: (senha, hash) => typeof hash === "string" && hash.startsWith("$2") ? bcrypt.compare(senha, hash) : Promise.resolve(false),
    gerarToken(usuario) {
      const publico = usuarioPublico(usuario);
      return jwt.sign(publico, authSecret, { algorithm: "HS256", expiresIn: authExpiresIn, issuer: "lab365petamigo", audience: "lab365petamigo-web", subject: `${publico.role}:${publico.id}`, jwtid: randomUUID() });
    },
    validarToken(token) {
      try {
        const payload = jwt.verify(token, authSecret, { algorithms: ["HS256"], issuer: "lab365petamigo", audience: "lab365petamigo-web" });
        if (!Number.isSafeInteger(payload.id) || payload.id < 1 || !Object.values(ROLE).includes(payload.role)) return null;
        if (!Number.isInteger(payload.exp) || payload.sub !== `${payload.role}:${payload.id}`) return null;
        return usuarioPublico(payload);
      } catch { return null; }
    },
  };
}
