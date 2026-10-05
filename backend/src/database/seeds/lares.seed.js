import bcrypt from "bcrypt";
import { AppDataSource } from "../../config/database_postgres.js";
import { SALT_ROUNDS } from "../../constants/auth.js";

// Lares de exemplo (todos com senha 123456), em várias cidades e com perfis diferentes.
// "dias" = há quantos dias o lar se cadastrou.
const laresIniciais = [
  { nome: "Lar Recanto Feliz", email: "recanto@lares.com", telefone: "(85) 98888-1111", cep: "60150-160", rua: "Rua das Flores", numero: "120", bairro: "Aldeota", cidade: "Fortaleza", estado: "CE", moradia: "CASA_QUINTAL", moradores: 4, outros_animais: true, dias: 200 },
  { nome: "Lar Família Andrade", email: "andrade@lares.com", telefone: "(85) 97777-2222", cep: "61600-000", rua: "Avenida Central", numero: "45", bairro: "Centro", cidade: "Caucaia", estado: "CE", moradia: "APARTAMENTO", moradores: 2, outros_animais: false, dias: 190 },
  { nome: "Lar Sítio Bem-Te-Vi", email: "bemtevi@lares.com", telefone: "(85) 96666-3333", cep: "61940-000", rua: "Estrada do Sítio", numero: "S/N", bairro: "Zona Rural", cidade: "Maranguape", estado: "CE", moradia: "CASA_QUINTAL", moradores: 5, outros_animais: true, dias: 120 },
  { nome: "Lar Casa da Vó Neném", email: "vone@lares.com", telefone: "(85) 99123-4567", cep: "60840-280", rua: "Rua Frei Mansueto", numero: "88", bairro: "Messejana", cidade: "Fortaleza", estado: "CE", moradia: "CASA", moradores: 3, outros_animais: false, dias: 185 },
  { nome: "Lar Apê da Juliana", email: "juliana@lares.com", telefone: "(85) 98765-4321", cep: "60165-090", rua: "Avenida Beira-Mar", numero: "2500", bairro: "Meireles", cidade: "Fortaleza", estado: "CE", moradia: "APARTAMENTO", moradores: 1, outros_animais: true, dias: 180 },
  { nome: "Lar Família Oliveira", email: "oliveira@lares.com", telefone: "(85) 99876-5432", cep: "61760-000", rua: "Rua dos Coqueiros", numero: "300", bairro: "Centro", cidade: "Eusébio", estado: "CE", moradia: "CASA_QUINTAL", moradores: 6, outros_animais: true, dias: 170 },
  { nome: "Lar Recanto dos Bichos", email: "recantobichos@lares.com", telefone: "(88) 99654-3210", cep: "62010-000", rua: "Rua Coronel Rangel", numero: "77", bairro: "Centro", cidade: "Sobral", estado: "CE", moradia: "CASA_QUINTAL", moradores: 4, outros_animais: true, dias: 150 },
  { nome: "Lar Pedro e Marina", email: "pedromarina@lares.com", telefone: "(88) 99432-1098", cep: "63010-000", rua: "Rua São Pedro", numero: "1020", bairro: "Centro", cidade: "Juazeiro do Norte", estado: "CE", moradia: "CASA", moradores: 2, outros_animais: false, dias: 145 },
  { nome: "Lar Família Costa", email: "costa@lares.com", telefone: "(84) 99812-3344", cep: "59020-000", rua: "Avenida Hermes da Fonseca", numero: "650", bairro: "Tirol", cidade: "Natal", estado: "RN", moradia: "APARTAMENTO", moradores: 3, outros_animais: false, dias: 130 },
  { nome: "Lar Cantinho Feliz", email: "cantinho@lares.com", telefone: "(81) 99701-2233", cep: "52011-000", rua: "Rua da Aurora", numero: "15", bairro: "Boa Vista", cidade: "Recife", estado: "PE", moradia: "CASA", moradores: 4, outros_animais: true, dias: 105 },
  { nome: "Lar Família Lima", email: "lima@lares.com", telefone: "(86) 99555-7788", cep: "64000-000", rua: "Rua Areolino de Abreu", numero: "430", bairro: "Centro", cidade: "Teresina", estado: "PI", moradia: "CASA_QUINTAL", moradores: 5, outros_animais: false, dias: 95 },
  { nome: "Lar dos Estudantes", email: "estudantes@lares.com", telefone: "(85) 98444-9900", cep: "60020-181", rua: "Avenida da Universidade", numero: "2853", bairro: "Benfica", cidade: "Fortaleza", estado: "CE", moradia: "APARTAMENTO", moradores: 4, outros_animais: false, dias: 65 },
  { nome: "Lar Seu Raimundo", email: "raimundo@lares.com", telefone: "(85) 99333-1212", cep: "61700-000", rua: "Travessa do Porto", numero: "9", bairro: "Prainha", cidade: "Aquiraz", estado: "CE", moradia: "CASA_QUINTAL", moradores: 2, outros_animais: true, dias: 45 },
  { nome: "Lar Família Rocha", email: "rocha@lares.com", telefone: "(85) 98222-4545", cep: "61900-000", rua: "Rua 24", numero: "180", bairro: "Jereissati", cidade: "Maracanaú", estado: "CE", moradia: "CASA", moradores: 3, outros_animais: true, dias: 30 },
  { nome: "Lar Ana Beatriz", email: "anabeatriz@lares.com", telefone: "(83) 99111-6677", cep: "58038-000", rua: "Avenida Cabo Branco", numero: "1200", bairro: "Cabo Branco", cidade: "João Pessoa", estado: "PB", moradia: "APARTAMENTO", moradores: 1, outros_animais: false, dias: 14 },
  { nome: "Lar Novo Começo", email: "novocomeco@lares.com", telefone: "(85) 98000-3030", cep: "60415-000", rua: "Rua Padre Valdevino", numero: "560", bairro: "Joaquim Távora", cidade: "Fortaleza", estado: "CE", moradia: "CASA", moradores: 2, outros_animais: false, dias: 3 },
];

export const seedLares = async () => {
  try {
    await AppDataSource.initialize();

    const senhaHash = await bcrypt.hash("123456", SALT_ROUNDS);

    for (const { dias, ...lar } of laresIniciais) {
      await AppDataSource.query(
        `INSERT INTO lares_adotivos
          (nome, email, senha, telefone, cep, rua, numero, bairro, cidade, estado, moradia, moradores, outros_animais, criado_em, atualizado_em)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW() - make_interval(days => $14), NOW() - make_interval(days => $14))
         ON CONFLICT (email) DO NOTHING`,
        [lar.nome, lar.email, senhaHash, lar.telefone, lar.cep, lar.rua, lar.numero, lar.bairro, lar.cidade, lar.estado, lar.moradia, lar.moradores, lar.outros_animais, dias],
      );
    }

    const [{ total }] = await AppDataSource.query(`SELECT COUNT(*)::int AS total FROM lares_adotivos`);

    console.log(`Seed de lares adotivos concluída. Total de registros: ${total}`);
  } catch (error) {
    console.error("Erro ao criar seed de lares adotivos:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};
