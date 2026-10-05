import { EntitySchema } from "typeorm";

export const UsuarioEntity = new EntitySchema({
  name: "Usuario",
  tableName: "usuarios",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    nome: {
      type: "varchar",
      length: 50,
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
    },
    role: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    criado_em: {
      type: "timestamp with time zone",
      precision: 0,
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    atualizado_em: {
      type: "timestamp with time zone",
      precision: 0,
      nullable: false,
      updateDate: true,
    },
  },
});
