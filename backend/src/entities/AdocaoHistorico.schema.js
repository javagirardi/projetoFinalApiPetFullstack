import { EntitySchema } from "typeorm";
export const AdocaoHistoricoSchema = new EntitySchema({
  name: "AdocaoHistorico", tableName: "adocoes_historico",
  columns: {
    id: { type: Number, primary: true, generated: true }, adocao_id: { type: Number },
    usuario_id: { type: Number, nullable: true }, status: { type: String, length: 20 },
    observacao: { type: "text", nullable: true }, criado_em: { type: "timestamp", createDate: true },
  },
  relations: {
    adocao: { type: "many-to-one", target: "Adocao", joinColumn: { name: "adocao_id" }, nullable: false },
    usuario: { type: "many-to-one", target: "Usuario", joinColumn: { name: "usuario_id" }, nullable: true },
  },
});
