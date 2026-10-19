import { EntitySchema } from "typeorm";
export const LarAdotivoSchema = new EntitySchema({
  name: "LarAdotivo", tableName: "lares_adotivos",
  columns: {
    id: { type: Number, primary: true, generated: true },
    nome: { type: String, length: 100 },
    email: { type: String, length: 254, unique: true },
    senha_hash: { type: String, length: 128, select: false },
    telefone: { type: String, length: 15 }, cep: { type: String, length: 9 },
    estado: { type: String, length: 2 }, cidade: { type: String, length: 100 },
    bairro: { type: String, length: 150 }, rua: { type: String, length: 150 },
    numero: { type: String, length: 30 }, moradia: { type: String, length: 20 },
    moradores: { type: Number }, outros_animais: { type: Boolean },
    criado_em: { type: "timestamp", createDate: true },
    atualizado_em: { type: "timestamp", updateDate: true },
  },
  relations: { adocoes: { type: "one-to-many", target: "Adocao", inverseSide: "lar" } },
});
