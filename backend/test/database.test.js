import "reflect-metadata";
import test from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { DataSource } from "typeorm";
import { entities } from "../src/config/entities.js";
import { BaseInicial1792195200000 } from "../src/migrations/1792195200000-BaseInicial.js";

test("migração cria um PostgreSQL novo coerente com as entidades e protege a integridade", async (t) => {
  const db = new PGlite();
  const runner = {
    hasTable: async (table) => (await db.query("SELECT to_regclass($1) AS tabela", [table])).rows[0].tabela != null,
    query: (sql, params) => db.query(sql, params),
  };
  try {
    await new BaseInicial1792195200000().up(runner);
    const dataSource = new DataSource({ type: "postgres", entities, synchronize: false });
    await dataSource.buildMetadatas();
    const { rows } = await db.query("SELECT table_name, column_name, character_maximum_length, is_nullable FROM information_schema.columns WHERE table_schema = 'public'");
    for (const metadata of dataSource.entityMetadatas) {
      const columns = rows.filter((row) => row.table_name === metadata.tableName);
      assert.equal(columns.length, metadata.columns.length, `Colunas de ${metadata.tableName}`);
      for (const column of metadata.columns) {
        const actual = columns.find((row) => row.column_name === column.databaseName);
        assert.ok(actual, `${metadata.tableName}.${column.databaseName}`);
        if (column.length) assert.equal(actual.character_maximum_length, Number(column.length));
        assert.equal(actual.is_nullable === "YES", column.isNullable);
      }
    }
    // Fixtures de domínio; nenhum dado pessoal nem banco externo é utilizado.
    await db.exec(`
      INSERT INTO tipos (nome) VALUES ('Gato');
      INSERT INTO racas (nome) VALUES ('Sem raça definida');
      INSERT INTO cores (nome) VALUES ('Branco');
      INSERT INTO usuarios (nome, email, senha_hash) VALUES ('Equipe', 'equipe@example.com', 'hash-teste');
      INSERT INTO lares_adotivos (nome, email, senha_hash, telefone, cep, estado, cidade, bairro, rua, numero, moradia, moradores, outros_animais)
      VALUES ('Lar A', 'a@example.com', 'hash-teste', '(85) 99999-9999', '60160-230', 'CE', 'Fortaleza', 'Bairro', 'Rua', '1', 'CASA', 1, false),
             ('Lar B', 'b@example.com', 'hash-teste', '(85) 99999-9999', '60160-230', 'CE', 'Fortaleza', 'Bairro', 'Rua', '2', 'CASA', 1, false);
      INSERT INTO pets (nome, porte, tipo_id, raca_id, cor_id) VALUES ('Pet A', 'M', 1, 1, 1), ('Pet B', 'P', 1, 1, 1);
    `);

    await t.test("consulta de autenticação pode selecionar hash explicitamente e omite por padrão", async () => {
      const repo = dataSource.getRepository("Usuario");
      const [sql, params] = repo.createQueryBuilder("conta").addSelect("conta.senha_hash").where("conta.email = :email", { email: "equipe@example.com" }).getQueryAndParameters();
      const conta = (await db.query(sql, params)).rows[0];
      assert.equal(conta.conta_senha_hash, "hash-teste");
      const [publicSql, publicParams] = repo.createQueryBuilder("conta").getQueryAndParameters();
      assert.equal(Object.hasOwn((await db.query(publicSql, publicParams)).rows[0], "conta_senha_hash"), false);
    });

    await t.test("recusa reaplicar base sobre tabelas existentes sem remover registros", async () => {
      await assert.rejects(new BaseInicial1792195200000().up(runner), /já existe/);
      assert.equal((await db.query("SELECT count(*)::int AS total FROM pets")).rows[0].total, 2);
    });

    async function isolado(fn) {
      await db.exec("BEGIN");
      try { await fn(); } finally { await db.exec("ROLLBACK"); }
    }
    const pedido = (lar, status = "ANALISE") => db.query("INSERT INTO adocoes (pet_id, lar_adotivo_id, motivo, experiencia, tempo_sozinho, status) VALUES (1, $1, 'Quero adotar com responsabilidade', 'PRIMEIRO', 'ATE_4H', $2)", [lar, status]);

    await t.test("permite vários lares interessados, mas impede dois pedidos ativos do mesmo lar/pet", () => isolado(async () => {
      await pedido(1); await pedido(2);
      await assert.rejects(pedido(1), { code: "23505" });
    }));
    await t.test("permite novo pedido depois de encerrado, mas só um lar aprovado por pet", () => isolado(async () => {
      await pedido(1, "RECUSADA"); await pedido(1, "APROVADA");
      await assert.rejects(pedido(2, "APROVADA"), { code: "23505" });
    }));
    await t.test("adoção concluída impede outra aprovação para o mesmo pet", () => isolado(async () => {
      await pedido(1, "CONCLUIDA");
      await assert.rejects(pedido(2, "APROVADA"), { code: "23505" });
    }));
    await t.test("recusa status da etapa anterior", () => isolado(async () => {
      await assert.rejects(pedido(1, "FINALIZADO"), { code: "23514" });
    }));
    await t.test("recusa idade negativa e relação inexistente", async () => {
      await isolado(async () => assert.rejects(db.query("UPDATE pets SET idade_meses = -1 WHERE id = 1"), { code: "23514" }));
      await isolado(async () => assert.rejects(db.query("UPDATE pets SET raca_id = 999 WHERE id = 1"), { code: "23503" }));
    });
    await t.test("arquivamento exige data e motivo consistentes sem excluir histórico", async () => {
      await isolado(async () => assert.rejects(db.query("UPDATE pets SET arquivado_em = now() WHERE id = 1"), { code: "23514" }));
      await isolado(async () => {
        await pedido(1, "CANCELADA");
        await db.query("INSERT INTO adocoes_historico (adocao_id, status, observacao) SELECT id, status, 'Encerrado' FROM adocoes");
        await db.query("UPDATE pets SET arquivado_em = now(), motivo_arquivamento = 'Transferido' WHERE id = 1");
        assert.equal((await db.query("SELECT count(*)::int AS total FROM adocoes_historico")).rows[0].total, 1);
      });
    });
  } finally { await db.close(); }
});
