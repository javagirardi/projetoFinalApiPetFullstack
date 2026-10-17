import { EntitySchema } from "typeorm";

export const TipoSchema = new EntitySchema({
  name: "Tipo",
  tableName: "tipos",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    nome: {
      type: String,
      length: 80,
      unique: true,
    },
  },
  relations: {
    pets: {
      type: "one-to-many",
      target: "Pet",
      inverseSide: "tipo",
    },
  },
});
