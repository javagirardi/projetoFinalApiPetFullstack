import "reflect-metadata";
import { EventEmitter } from "node:events";
import { PGlite } from "@electric-sql/pglite";
import { DataSource } from "typeorm";
import { entities } from "../../src/config/entities.js";
import { BaseInicial1792195200000 } from "../../src/migrations/1792195200000-BaseInicial.js";

// Executa o SQL real do TypeORM no PostgreSQL em memória. Uma conexão, testes sequenciais.
export async function criarBancoTeste() {
  const db = new PGlite();
  await new BaseInicial1792195200000().up({
    hasTable: async (table) => (await db.query("SELECT to_regclass($1) AS tabela", [table])).rows[0].tabela != null,
    query: (sql, params) => db.query(sql, params),
  });
  const dataSource = new DataSource({ type: "postgres", database: "teste", schema: "public", entities, synchronize: false });
  await dataSource.buildMetadatas();
  const connection = new EventEmitter();
  connection.query = async (sql, params) => {
    const resultado = await db.query(sql, params);
    return { rows: resultado.rows, rowCount: resultado.affectedRows ?? resultado.rows.length, command: sql.trim().split(/\s+/)[0].toUpperCase() };
  };
  dataSource.driver.obtainMasterConnection = async () => [connection, () => {}];
  dataSource.isInitialized = true;
  return { dataSource, db, close: () => db.close() };
}
