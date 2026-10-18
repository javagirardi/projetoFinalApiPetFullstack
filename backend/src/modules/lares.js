import { Router } from "express";
import { ROLE, validarLar } from "@lab365/contracts";
import { autenticar, exigirRole } from "../auth/middleware.js";
import { HttpError } from "../http/errors.js";

export function criarRotasLares({ dataSource, seguranca }) {
  const router = Router();
  router.post("/lares-adotivos", async (req, res) => {
    const { dados, erros } = validarLar(req.body);
    if (Object.keys(erros).length) throw new HttpError(400, "Confira os campos informados.", erros);
    const { senha, ...cadastro } = dados;
    const senha_hash = await seguranca.hashSenha(senha);
    try {
      const lar = await dataSource.transaction(async (manager) => {
        // Mesmo protocolo deve ser usado por qualquer futura criação de conta da equipe.
        await manager.query("SELECT pg_advisory_xact_lock(hashtext($1))", [cadastro.email]);
        const equipeExiste = await manager.getRepository("Usuario").createQueryBuilder("u").where("LOWER(u.email) = :email", { email: cadastro.email }).getExists();
        const larExiste = await manager.getRepository("LarAdotivo").createQueryBuilder("l").where("LOWER(l.email) = :email", { email: cadastro.email }).getExists();
        if (equipeExiste || larExiste) throw new HttpError(409, "Este e-mail já está cadastrado.");
        return manager.getRepository("LarAdotivo").save({ ...cadastro, senha_hash });
      });
      const { senha_hash: hash, ...publico } = lar;
      return res.status(201).json(publico);
    } catch (error) {
      if (error.code === "23505") throw new HttpError(409, "Este e-mail já está cadastrado.");
      throw error;
    }
  });
  return router;
}
