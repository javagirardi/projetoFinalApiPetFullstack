import { EntitySchema } from "typeorm";
export const PetSchema = new EntitySchema({
  name: "Pet", tableName: "pets",
  columns: {
    id: { type: Number, primary: true, generated: true }, nome: { type: String, length: 100 },
    tipo_id: { type: Number }, raca_id: { type: Number }, cor_id: { type: Number },
    porte: { type: String, length: 1 }, sexo: { type: String, length: 1, nullable: true },
    foto_url: { type: String, length: 255, nullable: true },
    historia: { type: "text", nullable: true }, comportamento: { type: "text", nullable: true },
    observacoes_extras: { type: "text", nullable: true }, idade_meses: { type: Number, nullable: true },
    arquivado_em: { type: "timestamp", nullable: true }, motivo_arquivamento: { type: String, length: 255, nullable: true },
    criado_em: { type: "timestamp", createDate: true }, atualizado_em: { type: "timestamp", updateDate: true },
  },
  relations: {
    tipo: { type: "many-to-one", target: "Tipo", joinColumn: { name: "tipo_id" }, nullable: false },
    raca: { type: "many-to-one", target: "Raca", joinColumn: { name: "raca_id" }, nullable: false },
    cor: { type: "many-to-one", target: "Cor", joinColumn: { name: "cor_id" }, nullable: false },
    adocoes: { type: "one-to-many", target: "Adocao", inverseSide: "pet" },
  },
});
