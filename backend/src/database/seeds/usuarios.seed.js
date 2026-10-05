import bcrypt from "bcrypt";
import { AppDataSource } from "../../config/database_postgres.js";
import { UsuarioEntity } from "../../entidades/Usuario.js";
import { ROLES } from "../../constants/roles.js";
import { SALT_ROUNDS } from "../../constants/auth.js";

// Equipe inicial da ONG (todos com o mesmo perfil)
const equipe = [
  { nome: "Administrador", email: "admin@lab365petamigo.com", senha: "admin123", role: ROLES.ADMIN },
  { nome: "Rafael Souza", email: "rafael@lab365petamigo.com", senha: "admin123", role: ROLES.ADMIN },
  { nome: "Carla Mendes", email: "carla@lab365petamigo.com", senha: "admin123", role: ROLES.ADMIN },
];

export const usuarioSeed = async () => {
  try {
    await AppDataSource.initialize();

    const usuarioRepository = AppDataSource.getRepository(UsuarioEntity);

    for (const membro of equipe) {
      const usuarioExistente = await usuarioRepository.findOneBy({
        email: membro.email,
      });

      if (usuarioExistente) {
        console.log(`Usuário já existe: ${membro.email}`);
        continue;
      }

      const senhaHash = await bcrypt.hash(membro.senha, SALT_ROUNDS);

      // sem id fixo: deixar o SERIAL gerar mantém a sequência correta
      await usuarioRepository.save({ ...membro, senha: senhaHash });

      console.log(`Seed concluída. Usuário criado com e-mail: ${membro.email}`);
    }
  } catch (error) {
    console.error("Erro ao criar seed de usuário admin:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};
