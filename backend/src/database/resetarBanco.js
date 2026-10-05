import { readFile } from "node:fs/promises";
import { AppDataSource } from "../config/database_postgres.js";

// APAGA TODOS OS DADOS do banco configurado no .env e recria as tabelas do zero.
// Use em desenvolvimento, para voltar ao estado das seeds (npm run db:resetar).
const resetarBanco = async () => {
  try {
    await AppDataSource.initialize();

    await AppDataSource.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
    const sql = await readFile(new URL("./database.sql", import.meta.url), "utf-8");
    await AppDataSource.query(sql);

    console.log(`Banco "${process.env.DB_NAME}" zerado e tabelas recriadas.`);
  } catch (error) {
    console.error("Erro ao resetar o banco:", error.message);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};

resetarBanco();
