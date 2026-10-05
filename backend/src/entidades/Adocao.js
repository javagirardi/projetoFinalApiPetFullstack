import { EntitySchema } from "typeorm";

export const AdocaoEntity = new EntitySchema({
  name: "Adocao",
  tableName: "adocoes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    pet_id: {
      type: "int",
      nullable: false,
    },
    lar_adotivo_id: {
      type: "int",
      nullable: false,
    },
    status: {
      type: "varchar",
      length: 255,
      nullable: false,
      default: "ANALISE",
    },
    motivo: {
      type: "text",
      nullable: false,
    },
    experiencia: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    tempo_sozinho: {
      type: "varchar",
      length: 255,
      nullable: false,
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
