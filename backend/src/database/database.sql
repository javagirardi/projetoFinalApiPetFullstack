CREATE TABLE "pets"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "tipo_id" INTEGER NOT NULL,
    "raca_id" INTEGER NOT NULL,
    "cor_id" INTEGER NOT NULL,
    "porte" VARCHAR(255) CHECK
        ("porte" IN('P', 'M', 'G')) NOT NULL,
    "sexo" VARCHAR(255) CHECK
        ("sexo" IN('M', 'F')) NULL,
    "foto_url" VARCHAR(255) NULL,
    "historia" TEXT NULL,
    "comportamento" TEXT NULL,
    "observacoes_extras" TEXT NULL,
    "idade_meses" INTEGER NULL,
    "arquivado_em" TIMESTAMP(0) WITH TIME ZONE NULL,
    "motivo_arquivamento" VARCHAR(255) NULL,
    "criado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    -- pet arquivado sempre tem motivo (e só ele tem)
    CONSTRAINT "pets_arquivamento_check" CHECK
        (("arquivado_em" IS NULL) = ("motivo_arquivamento" IS NULL))
);
ALTER TABLE
    "pets" ADD PRIMARY KEY("id");

CREATE TABLE "tipos"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE
    "tipos" ADD PRIMARY KEY("id");
ALTER TABLE
    "tipos" ADD CONSTRAINT "tipos_nome_unique" UNIQUE("nome");

CREATE TABLE "racas"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE
    "racas" ADD PRIMARY KEY("id");
ALTER TABLE
    "racas" ADD CONSTRAINT "racas_nome_unique" UNIQUE("nome");

CREATE TABLE "cores"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE
    "cores" ADD PRIMARY KEY("id");
ALTER TABLE
    "cores" ADD CONSTRAINT "cores_nome_unique" UNIQUE("nome");

-- Equipe da ONG (acessa o painel administrativo)
CREATE TABLE "usuarios"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "role" VARCHAR(255) CHECK
        ("role" IN('admin')) NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE
    "usuarios" ADD PRIMARY KEY("id");
ALTER TABLE
    "usuarios" ADD CONSTRAINT "usuarios_email_unique" UNIQUE("email");

-- Lares adotivos (fazem cadastro e login no site para pedir adoções; o acompanhamento é pelo WhatsApp)
CREATE TABLE "lares_adotivos"(
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "telefone" VARCHAR(20) NOT NULL,
    "cep" VARCHAR(9) NOT NULL,
    "rua" VARCHAR(150) NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "bairro" VARCHAR(100) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "estado" CHAR(2) NOT NULL,
    "moradia" VARCHAR(255) CHECK
        ("moradia" IN('CASA', 'CASA_QUINTAL', 'APARTAMENTO')) NOT NULL,
    "moradores" INTEGER CHECK ("moradores" >= 1) NOT NULL,
    "outros_animais" BOOLEAN NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE
    "lares_adotivos" ADD PRIMARY KEY("id");
ALTER TABLE
    "lares_adotivos" ADD CONSTRAINT "lares_adotivos_email_unique" UNIQUE("email");

-- Pedidos de adoção (processos)
-- ANALISE -> ENTREVISTA -> APROVADA -> CONCLUIDA, ou RECUSADA / CANCELADA antes de concluir
CREATE TABLE "adocoes"(
    "id" SERIAL NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "lar_adotivo_id" INTEGER NOT NULL,
    "status" VARCHAR(255) CHECK
        ("status" IN('ANALISE', 'ENTREVISTA', 'APROVADA', 'CONCLUIDA', 'RECUSADA', 'CANCELADA')) NOT NULL DEFAULT 'ANALISE',
    "motivo" TEXT NOT NULL,
    "experiencia" VARCHAR(255) CHECK
        ("experiencia" IN('PRIMEIRO', 'JA_TEVE', 'TEM_OUTROS')) NOT NULL,
    "tempo_sozinho" VARCHAR(255) CHECK
        ("tempo_sozinho" IN('ATE_4H', 'DE_4_A_8H', 'MAIS_8H')) NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE
    "adocoes" ADD PRIMARY KEY("id");
-- Um lar só tem um pedido em andamento por pet
CREATE UNIQUE INDEX "adocoes_pedido_ativo_unique" ON "adocoes"("pet_id", "lar_adotivo_id")
    WHERE "status" IN('ANALISE', 'ENTREVISTA', 'APROVADA');
-- Um pet só pode estar reservado (APROVADA) ou adotado (CONCLUIDA) por um lar
CREATE UNIQUE INDEX "adocoes_pet_reservado_unique" ON "adocoes"("pet_id")
    WHERE "status" IN('APROVADA', 'CONCLUIDA');

-- Etapas de cada pedido, com a observação e quem da equipe fez a mudança (vazio no pedido feito pelo site)
CREATE TABLE "adocoes_historico"(
    "id" SERIAL NOT NULL,
    "adocao_id" INTEGER NOT NULL,
    "status" VARCHAR(255) CHECK
        ("status" IN('ANALISE', 'ENTREVISTA', 'APROVADA', 'CONCLUIDA', 'RECUSADA', 'CANCELADA')) NOT NULL,
    "observacao" TEXT NULL,
    "usuario_id" INTEGER NULL,
    "criado_em" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE
    "adocoes_historico" ADD PRIMARY KEY("id");

ALTER TABLE
    "pets" ADD CONSTRAINT "pets_cor_id_foreign" FOREIGN KEY("cor_id") REFERENCES "cores"("id");
ALTER TABLE
    "pets" ADD CONSTRAINT "pets_tipo_id_foreign" FOREIGN KEY("tipo_id") REFERENCES "tipos"("id");
ALTER TABLE
    "pets" ADD CONSTRAINT "pets_raca_id_foreign" FOREIGN KEY("raca_id") REFERENCES "racas"("id");
ALTER TABLE
    "adocoes" ADD CONSTRAINT "adocoes_pet_id_foreign" FOREIGN KEY("pet_id") REFERENCES "pets"("id");
ALTER TABLE
    "adocoes" ADD CONSTRAINT "adocoes_lar_adotivo_id_foreign" FOREIGN KEY("lar_adotivo_id") REFERENCES "lares_adotivos"("id");
ALTER TABLE
    "adocoes_historico" ADD CONSTRAINT "adocoes_historico_adocao_id_foreign" FOREIGN KEY("adocao_id") REFERENCES "adocoes"("id") ON DELETE CASCADE;
ALTER TABLE
    "adocoes_historico" ADD CONSTRAINT "adocoes_historico_usuario_id_foreign" FOREIGN KEY("usuario_id") REFERENCES "usuarios"("id");
