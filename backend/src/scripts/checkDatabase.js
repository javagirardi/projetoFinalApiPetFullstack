import dataSource from "../config/database.js";
try {
  await dataSource.initialize();
  await dataSource.query("SELECT 1");
  console.log("Conexão com PostgreSQL confirmada. Nenhuma migração foi executada.");
} catch (error) {
  console.error("Falha na conexão:", error.code || error.name);
  process.exitCode = 1;
} finally { if (dataSource.isInitialized) await dataSource.destroy(); }
