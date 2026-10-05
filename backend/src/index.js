import "dotenv/config";

import express from "express";
import cors from "cors";

import { PORT_SERVER } from "./constants/server.js";
import { AppDataSource } from "./config/database_postgres.js";

import { captureLog } from "./middlewares/global/captureLog.js";
import { errorHandler } from "./middlewares/global/errorHandler.js";
import { validateJwtHandler } from "./middlewares/auth/validateJwtHandler.js";

import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import petsRoutes from "./routes/pets.routes.js";
import laresRoutes from "./routes/lares.routes.js";
import adocoesRoutes from "./routes/adocoes.routes.js";
import minhasAdocoesRoutes from "./routes/minhasAdocoes.routes.js";

const app = express();
app.use(express.json()); // habilita o servidor para reconhecer formato JSON
app.use(cors());

app.use(captureLog); // aplicando o middleware de forma global no inicio de cada rota

app.use(publicRoutes); // login, cadastro do lar, vitrine de pets e listas (tipos, raças, cores)

app.use(validateJwtHandler); // aplicar o token em todas as rotas abaixo
app.use(authRoutes);
app.use(petsRoutes);
app.use(laresRoutes);
app.use(adocoesRoutes);
app.use(minhasAdocoesRoutes);

app.use(errorHandler); // aplicando o middleware de forma global no fim de cada rota

try {
  await AppDataSource.initialize();
  const porta = Number(process.env.PORT) || PORT_SERVER;
  app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
  });
} catch (error) {
  console.log("Erro ao conectar com o banco de dados", error);
}
