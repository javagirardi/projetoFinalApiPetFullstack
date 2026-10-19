// Snapshot imutável: migrações antigas não devem mudar quando o contrato evoluir.
const status = "'ANALISE', 'ENTREVISTA', 'APROVADA', 'CONCLUIDA', 'RECUSADA', 'CANCELADA'";
const timestamps = '"criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now()';

export class BaseInicial1792195200000 {
  name = "BaseInicial1792195200000";

  async up(queryRunner) {
    // A base antiga deve ser migrada deliberadamente, sem inferir status ou credenciais.
    for (const tabela of ["usuarios", "lares_adotivos", "pets", "tipos", "racas", "cores", "adocoes", "adocoes_historico"]) {
      if (await queryRunner.hasTable(tabela)) {
        throw new Error(`A tabela ${tabela} já existe. Use um banco vazio para esta base; o banco da etapa anterior deve ser preservado.`);
      }
    }
    for (const tabela of ["tipos", "racas", "cores"]) {
      const tamanho = tabela === "racas" ? 100 : 80;
      await queryRunner.query(`CREATE TABLE "${tabela}" ("id" SERIAL PRIMARY KEY, "nome" varchar(${tamanho}) NOT NULL UNIQUE)`);
    }
    await queryRunner.query(`CREATE TABLE "usuarios" (
      "id" SERIAL PRIMARY KEY, "nome" varchar(100) NOT NULL,
      "email" varchar(254) NOT NULL UNIQUE, "senha_hash" varchar(128) NOT NULL,
      "ativo" boolean NOT NULL DEFAULT true, ${timestamps}
    )`);
    await queryRunner.query(`CREATE TABLE "lares_adotivos" (
      "id" SERIAL PRIMARY KEY, "nome" varchar(100) NOT NULL,
      "email" varchar(254) NOT NULL UNIQUE, "senha_hash" varchar(128) NOT NULL,
      "telefone" varchar(15) NOT NULL, "cep" varchar(9) NOT NULL,
      "estado" varchar(2) NOT NULL, "cidade" varchar(100) NOT NULL,
      "bairro" varchar(150) NOT NULL, "rua" varchar(150) NOT NULL, "numero" varchar(30) NOT NULL,
      "moradia" varchar(20) NOT NULL CHECK ("moradia" IN ('CASA', 'CASA_QUINTAL', 'APARTAMENTO')),
      "moradores" integer NOT NULL CHECK ("moradores" >= 1), "outros_animais" boolean NOT NULL, ${timestamps}
    )`);
    await queryRunner.query(`CREATE TABLE "pets" (
      "id" SERIAL PRIMARY KEY, "nome" varchar(100) NOT NULL,
      "porte" varchar(1) NOT NULL CHECK ("porte" IN ('P', 'M', 'G')),
      "sexo" varchar(1) CHECK ("sexo" IN ('M', 'F')),
      "foto_url" varchar(255), "historia" text, "comportamento" text, "observacoes_extras" text,
      "idade_meses" integer CHECK ("idade_meses" >= 0),
      "arquivado_em" TIMESTAMP, "motivo_arquivamento" varchar(255),
      "tipo_id" integer NOT NULL REFERENCES "tipos"("id"),
      "raca_id" integer NOT NULL REFERENCES "racas"("id"),
      "cor_id" integer NOT NULL REFERENCES "cores"("id"), ${timestamps},
      CHECK (("arquivado_em" IS NULL) = ("motivo_arquivamento" IS NULL))
    )`);
    await queryRunner.query(`CREATE TABLE "adocoes" (
      "id" SERIAL PRIMARY KEY, "pet_id" integer NOT NULL REFERENCES "pets"("id"),
      "lar_adotivo_id" integer NOT NULL REFERENCES "lares_adotivos"("id"),
      "status" varchar(20) NOT NULL DEFAULT 'ANALISE' CHECK ("status" IN (${status})),
      "motivo" text NOT NULL,
      "experiencia" varchar(20) NOT NULL CHECK ("experiencia" IN ('PRIMEIRO', 'JA_TEVE', 'TEM_OUTROS')),
      "tempo_sozinho" varchar(20) NOT NULL CHECK ("tempo_sozinho" IN ('ATE_4H', 'DE_4_A_8H', 'MAIS_8H')), ${timestamps}
    )`);
    await queryRunner.query(`CREATE TABLE "adocoes_historico" (
      "id" SERIAL PRIMARY KEY, "adocao_id" integer NOT NULL REFERENCES "adocoes"("id"),
      "usuario_id" integer REFERENCES "usuarios"("id"),
      "status" varchar(20) NOT NULL CHECK ("status" IN (${status})),
      "observacao" text, "criado_em" TIMESTAMP NOT NULL DEFAULT now()
    )`);
    await queryRunner.query('CREATE INDEX "idx_adocoes_lar_atualizacao" ON "adocoes" ("lar_adotivo_id", "atualizado_em" DESC)');
    await queryRunner.query('CREATE INDEX "idx_adocoes_pet_status" ON "adocoes" ("pet_id", "status")');
    await queryRunner.query('CREATE INDEX "idx_historico_adocao_data" ON "adocoes_historico" ("adocao_id", "criado_em")');
    await queryRunner.query(`CREATE UNIQUE INDEX "uq_pedido_ativo_lar_pet" ON "adocoes" ("lar_adotivo_id", "pet_id") WHERE "status" IN ('ANALISE', 'ENTREVISTA', 'APROVADA')`);
    await queryRunner.query(`CREATE UNIQUE INDEX "uq_pet_aprovado_ou_concluido" ON "adocoes" ("pet_id") WHERE "status" IN ('APROVADA', 'CONCLUIDA')`);
  }

  async down() {
    throw new Error("Esta migração inicial não remove tabelas automaticamente. Restaure um backup ou descarte apenas um banco de desenvolvimento identificado explicitamente.");
  }
}
