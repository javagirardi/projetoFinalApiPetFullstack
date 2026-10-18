import { EntitySchema } from "typeorm";
export const UsuarioSchema = new EntitySchema({
  name: "Usuario", tableName: "usuarios",
  columns: {
    id: { type: Number, primary: true, generated: true },
    nome: { type: String, length: 100 },
    email: { type: String, length: 254, unique: true },
    senha_hash: { type: String, length: 128, select: false },
    ativo: { type: Boolean, default: true },
    criado_em: { type: "timestamp", createDate: true },
    atualizado_em: { type: "timestamp", updateDate: true },
  },
});
