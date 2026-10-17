import "reflect-metadata";
import { DataSource } from "typeorm";
import { carregarConfiguracao } from "./env.js";
import { entities } from "./entities.js";
import { BaseInicial1792195200000 } from "../migrations/1792195200000-BaseInicial.js";

const config = carregarConfiguracao();
export default new DataSource({
  type: "postgres", ...config.database, synchronize: false, migrationsRun: false,
  entities,
  migrations: [BaseInicial1792195200000],
});
