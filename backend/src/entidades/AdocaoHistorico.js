import { EntitySchema } from "typeorm";

export const AdocaoHistoricoEntity = new EntitySchema({
  name: "AdocaoHistorico",
  tableName: "adocoes_historico",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    adocao_id: {
      type: "int",
      nullable: false,
    },
    status: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    observacao: {
      type: "text",
      nullable: true,
    },
    usuario_id: {
      type: "int",
      nullable: true,
    },
    criado_em: {
      type: "timestamp with time zone",
      precision: 0,
      nullable: false,
      createDate: true,
    },
  },
});
