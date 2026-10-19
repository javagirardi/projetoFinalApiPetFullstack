import { EntitySchema } from "typeorm";
import { STATUS_ADOCAO } from "@lab365/contracts";
export const AdocaoSchema = new EntitySchema({
  name: "Adocao", tableName: "adocoes",
  columns: {
    id: { type: Number, primary: true, generated: true },
    pet_id: { type: Number }, lar_adotivo_id: { type: Number },
    status: { type: String, length: 20, default: STATUS_ADOCAO.ANALISE },
    motivo: { type: "text" }, experiencia: { type: String, length: 20 }, tempo_sozinho: { type: String, length: 20 },
    criado_em: { type: "timestamp", createDate: true }, atualizado_em: { type: "timestamp", updateDate: true },
  },
  relations: {
    pet: { type: "many-to-one", target: "Pet", joinColumn: { name: "pet_id" }, nullable: false },
    lar: { type: "many-to-one", target: "LarAdotivo", joinColumn: { name: "lar_adotivo_id" }, nullable: false },
    historico: { type: "one-to-many", target: "AdocaoHistorico", inverseSide: "adocao" },
  },
});
