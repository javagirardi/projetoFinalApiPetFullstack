import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { AppDataSource } from "../config/database_postgres.js";

import { UsuarioEntity } from "../entidades/Usuario.js";
import { LarAdotivoEntity } from "../entidades/LarAdotivo.js";

import { BAD_REQUEST_STATUS, OK_STATUS } from "../constants/server.js";
import { ROLES } from "../constants/roles.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../constants/auth.js";

const publicRoutes = new Router();

const usuarioRepository = AppDataSource.getRepository(UsuarioEntity);
const larRepository = AppDataSource.getRepository(LarAdotivoEntity);

const gerarToken = (id, role) =>
  jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

publicRoutes.post("/auth/login", async (request, response) => {
  const dados = request.body ?? {};

  if (!dados.email || !dados.senha) {
    response
      .status(BAD_REQUEST_STATUS)
      .send({ error: "email e senha são obrigatórios" });
    return;
  }

  const email = String(dados.email).trim().toLowerCase();

  const usuario = await usuarioRepository.findOneBy({ email });
  const lar = usuario
    ? null
    : await larRepository
        .createQueryBuilder("lar")
        .addSelect("lar.senha")
        .where("lar.email = :email", { email })
        .getOne();
  const conta = usuario || lar;

  const senhaCorreta = conta && (await bcrypt.compare(String(dados.senha), conta.senha));

  if (!senhaCorreta) {
    response.status(BAD_REQUEST_STATUS).send({
      error: "Credenciais incorretas",
    });
    return;
  }

  const role = usuario ? usuario.role : ROLES.LAR;

  response.status(OK_STATUS).send({
    id: conta.id,
    nome: conta.nome,
    email: conta.email,
    role,
    token: gerarToken(conta.id, role),
  });
});

export default publicRoutes;
