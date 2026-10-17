import { EntitySchema } from "typeorm";

export const RacaSchema = new EntitySchema({
  name: "Raca",
  tableName: "racas",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    nome: {
      type: String,
      length: 100,
      unique: true,
    },
  },
  relations: {
    pets: {
      type: "one-to-many",
      target: "Pet",
      inverseSide: "raca",
    },
  },
});
