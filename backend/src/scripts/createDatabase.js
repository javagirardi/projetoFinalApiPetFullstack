import pg from "pg";
import { carregarConfiguracao } from "../config/env.js";
const { database } = carregarConfiguracao();
if (database.database !== "lab365petamigo_modulo4") throw new Error("A preparação automática está limitada ao banco lab365petamigo_modulo4. Nenhum banco foi alterado.");
const client = new pg.Client({ host: database.host, port: database.port, user: database.username, password: database.password, database: "postgres", connectionTimeoutMillis: 5000 });
try {
  await client.connect();
  const existe = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [database.database]);
  if (existe.rowCount) console.log("O banco da nova etapa já existe e foi preservado.");
  else { await client.query('CREATE DATABASE "lab365petamigo_modulo4"'); console.log("Banco separado da nova etapa criado."); }
} catch (error) { console.error("Não foi possível preparar o banco:", error.code || error.name); process.exitCode = 1; }
finally { await client.end(); }
