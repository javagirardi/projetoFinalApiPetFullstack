import { EntitySchema } from "typeorm";

export const PetEntity = new EntitySchema({
  name: "Pet",
  tableName: "pets",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    nome: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    tipo_id: {
      type: "int",
      nullable: false,
    },
    raca_id: {
      type: "int",
      nullable: false,
    },
    cor_id: {
      type: "int",
      nullable: false,
    },
    porte: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    sexo: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    foto_url: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    historia: {
      type: "text",
      nullable: true,
    },
    comportamento: {
      type: "text",
      nullable: true,
    },
    observacoes_extras: {
      type: "text",
      nullable: true,
    },
    idade_meses: {
      type: "int",
      nullable: true,
    },
    arquivado_em: {
      type: "timestamp with time zone",
      precision: 0,
      nullable: true,
    },
    motivo_arquivamento: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    criado_em: {
      type: "timestamp with time zone",
      precision: 0,
      nullable: false,
      createDate: true,
    },
    atualizado_em: {
      type: "timestamp with time zone",
      precision: 0,
      nullable: false,
      updateDate: true,
    },
  },
});
