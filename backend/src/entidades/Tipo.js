import { EntitySchema } from "typeorm";

export const TipoEntity = new EntitySchema({
  name: "Tipo",
  tableName: "tipos",
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
