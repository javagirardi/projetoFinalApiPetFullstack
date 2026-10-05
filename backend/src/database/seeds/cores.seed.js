import { AppDataSource } from "../../config/database_postgres.js";

// Cores de pelagem de cães e gatos
const coresPet = [
  "Outro",
  "Preto",
  "Branco",
  "Marrom",
  "Caramelo",
  "Bege",
  "Cinza",
  "Cinza-escuro",
  "Creme",
  "Laranja",
  "Dourado",
  "Chocolate",
  "Castanho",
  "Prata",
  "Marfim",
  "Avelã",
];

export const seedCores = async () => {
  try {
    await AppDataSource.initialize();

    for (const nome of coresPet) {
      await AppDataSource.query(
        `INSERT INTO cores (nome) VALUES ($1) ON CONFLICT (nome) DO NOTHING`,
        [nome],
      );
    }

    const [{ total }] = await AppDataSource.query(
      `SELECT COUNT(*)::int AS total FROM cores`,
    );

    console.log(`Seed de cores concluída. Total de registros: ${total}`);
  } catch (error) {
    console.error("Erro ao criar seed de cores:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};
