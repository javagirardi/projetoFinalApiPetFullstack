import express from "express";
import cors from "cors";
import { criarRotasAuth } from "./auth/routes.js";
import { errorHandler, HttpError } from "./http/errors.js";
import { criarRotasPets } from "./modules/pets.js";
import { criarRotasLares } from "./modules/lares.js";

export function criarApp({ config, repositorioAuth, seguranca, verificarBanco, dataSource }) {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ origin: config.frontendOrigin }));
  app.use(express.json({ limit: "100kb" }));
  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.get("/health/ready", async (req, res) => {
    try { await verificarBanco(); return res.json({ status: "ok", banco: "conectado" }); }
    catch { return res.status(503).json({ error: "Banco de dados indisponível.", erro: "Banco de dados indisponível." }); }
  });
  app.use(criarRotasAuth({ repositorioAuth, seguranca }));
  if (dataSource) {
    app.use(criarRotasLares({ dataSource, seguranca }));
    app.use(criarRotasPets({ dataSource, seguranca }));
  }
  app.use((req, res, next) => next(new HttpError(404, "Rota não encontrada.")));
  app.use(errorHandler);
  return app;
}
