import { Router } from "express";
import { usuarioPublico } from "@lab365/contracts";
import { HttpError } from "../http/errors.js";

export function criarRotasAuth({ repositorioAuth, seguranca }) {
  const router = Router();
  router.post("/auth/login", async (req, res) => {
    const { email, senha } = req.body || {};
    const erros = {};
    if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) erros.email = "Informe um e-mail válido.";
    if (typeof senha !== "string" || !senha) erros.senha = "Informe a senha.";
    // Bcrypt considera no máximo 72 bytes; não aceitar credenciais truncadas.
    else if (Buffer.byteLength(senha, "utf8") > 72) erros.senha = "A senha deve ter no máximo 72 bytes em UTF-8.";
    if (Object.keys(erros).length) throw new HttpError(400, "Confira os campos informados.", erros);
    const conta = await repositorioAuth.buscarPorEmail(email.trim().toLowerCase());
    if (!conta || !(await seguranca.compararSenha(senha, conta.senha_hash))) throw new HttpError(401, "E-mail ou senha inválidos.");
    const usuario = usuarioPublico(conta);
    return res.json({ ...usuario, token: seguranca.gerarToken(usuario) });
  });
  return router;
}
