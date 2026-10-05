import { usuarioSeed } from "./usuarios.seed.js";
import { seedCores } from "./cores.seed.js";
import { seedRacas } from "./racas.seed.js";
import { seedTiposPets } from "./tipos_pets.seed.js";
import { seedPets } from "./pets.seed.js";
import { seedLares } from "./lares.seed.js";
import { seedAdocoes } from "./adocoes.seed.js";

const runAllSeeds = async () => {
  try {
    await usuarioSeed();
    await seedCores();
    await seedRacas();
    await seedTiposPets();
    await seedPets(); // depende de tipos, raças e cores
    await seedLares();
    await seedAdocoes(); // depende de pets, lares e do admin

    console.log("\nTodas as seeds foram executadas com sucesso.");
  } catch (error) {
    console.error("Erro ao executar as seeds:", error.message);
    process.exitCode = 1;
  }
};

runAllSeeds();
