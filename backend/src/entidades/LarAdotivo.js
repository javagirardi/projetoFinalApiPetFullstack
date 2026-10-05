import { EntitySchema } from "typeorm";

export const LarAdotivoEntity = new EntitySchema({
  name: "LarAdotivo",
  tableName: "lares_adotivos",
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
    email: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    senha: {
      type: "varchar",
      length: 100,
      nullable: false,
      select: false,
    },
    telefone: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    cep: {
      type: "varchar",
      length: 9,
      nullable: false,
    },
    rua: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    numero: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    bairro: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    cidade: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    estado: {
      type: "char",
      length: 2,
      nullable: false,
    },
    moradia: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    moradores: {
      type: "int",
      nullable: false,
    },
    outros_animais: {
      type: "boolean",
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
