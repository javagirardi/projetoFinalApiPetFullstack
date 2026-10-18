import dataSource from "../config/database.js";
import { carregarConfiguracao } from "../config/env.js";
import { criarSeguranca } from "../auth/security.js";

try {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_PASSWORD;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !senha || senha.length < 6 || Buffer.byteLength(senha) > 72) throw new Error("Configure ADMIN_EMAIL e ADMIN_PASSWORD (6 caracteres a 72 bytes) antes do seed.");
  await dataSource.initialize();
  if (await dataSource.showMigrations()) throw new Error("Execute as migrações antes do seed.");
  const seguranca = criarSeguranca(carregarConfiguracao());
  await dataSource.transaction(async (manager) => {
    const catalogos = { Tipo: ["Cachorro", "Gato"], Raca: ["Sem raça definida", "Poodle", "Siamês"], Cor: ["Preto", "Branco", "Caramelo", "Cinza"] };
    for (const [entidade, nomes] of Object.entries(catalogos)) {
      const repo = manager.getRepository(entidade);
      for (const nome of nomes) if (!(await repo.existsBy({ nome }))) await repo.save({ nome });
    }
    await manager.query("SELECT pg_advisory_xact_lock(hashtext($1))", [email]);
    if (await manager.getRepository("LarAdotivo").existsBy({ email })) throw new Error("O e-mail da equipe já pertence a um lar.");
    const usuarios = manager.getRepository("Usuario");
    if (!(await usuarios.existsBy({ email }))) await usuarios.save({ nome: "Equipe Lab365PetAmigo", email, senha_hash: await seguranca.hashSenha(senha), ativo: true });
  });
  console.log("Catálogos e conta da equipe preparados; contas existentes foram preservadas.");
} catch (error) { console.error("Falha no seed:", error.code || error.message); process.exitCode = 1; }
finally { if (dataSource.isInitialized) await dataSource.destroy(); }
