import dataSource from "./config/database.js";
import { carregarConfiguracao } from "./config/env.js";
import { criarApp } from "./app.js";
import { criarSeguranca } from "./auth/security.js";
import { criarRepositorioAuth } from "./auth/repository.js";

const config = carregarConfiguracao();
try {
  await dataSource.initialize();
  if (await dataSource.showMigrations()) throw new Error("Há migrações pendentes. Prepare o banco novo e execute npm run db:migrate antes de iniciar a API.");
  const app = criarApp({ config, seguranca: criarSeguranca(config), repositorioAuth: criarRepositorioAuth(dataSource), dataSource, verificarBanco: () => dataSource.query("SELECT 1") });
  const server = app.listen(config.porta, () => console.log(`API em http://localhost:${config.porta}`));
  server.on("error", async (error) => { console.error("Não foi possível abrir a porta da API:", error.code); await dataSource.destroy(); process.exitCode = 1; });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => server.close(async () => { await dataSource.destroy(); process.exitCode = 0; }));
  }
} catch (error) {
  console.error("Não foi possível iniciar a API:", error.code || error.message);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exitCode = 1;
}
