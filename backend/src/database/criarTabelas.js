import { readFile } from "node:fs/promises";
import { AppDataSource } from "../config/database_postgres.js";

// Executa o database.sql no banco configurado no .env (rodar uma vez, com o banco vazio)
const criarTabelas = async () => {
  try {
    await AppDataSource.initialize();

    const sql = await readFile(new URL("./database.sql", import.meta.url), "utf-8");
    await AppDataSource.query(sql);

    console.log("Tabelas criadas com sucesso.");
  } catch (error) {
    console.error("Erro ao criar as tabelas:", error.message);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};

criarTabelas();
