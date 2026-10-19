import { EntitySchema } from "typeorm";

export const CorSchema = new EntitySchema({
  name: "Cor",
  tableName: "cores",
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
      inverseSide: "cor",
    },
  },
});
