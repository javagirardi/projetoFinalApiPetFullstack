import { AppDataSource } from "../../config/database_postgres.js";
import { petsExtras } from "./dados/petsExtras.js";

const foto = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;
const SRD = "SRD (sem raça definida)";

// Catálogo variado de cães e gatos, de filhotes a idosos, todos os portes,
// alguns sem foto, sem sexo ou sem idade conhecida (para testar esses casos no front).
// "chegou" = há quantos dias o pet entrou na ONG.
// "arquivado" = [há quantos dias, motivo], para pets que já saíram da ONG (somem da vitrine).
const petsIniciais = [
  // ---------- cachorros ----------
  { nome: "Thor", tipo: "Cachorro", raca: "Golden Retriever", cor: "Dourado", porte: "G", sexo: "M", idade_meses: 24, chegou: 200, foto_url: foto("photo-1552053831-71594a27632d"), historia: "Brincalhão, adora água e crianças.", comportamento: "Muito sociável com pessoas e outros cães." },
  { nome: "Bob", tipo: "Cachorro", raca: "Beagle", cor: "Marrom", porte: "M", sexo: "M", idade_meses: 36, chegou: 60, foto_url: foto("photo-1543466835-00a7907e9de1"), historia: "Farejador nato e muito sociável.", comportamento: "Precisa de passeios diários.", observacoes_extras: "Vacinado e castrado." },
  { nome: "Paçoca", tipo: "Cachorro", raca: SRD, cor: "Branco", porte: "M", sexo: "F", idade_meses: 8, chegou: 40, foto_url: foto("photo-1587300003388-59208cc962cb"), historia: "Filhote cheio de energia e amor.", comportamento: "Brincalhona, ainda aprendendo comandos.",
    arquivado: [9, "Voltou para a tutora, que a reencontrou por um anúncio de pet perdido."] },
  { nome: "Lola", tipo: "Cachorro", raca: "Bulldog Francês", cor: "Bege", porte: "P", sexo: "F", idade_meses: 20, chegou: 170, foto_url: foto("photo-1583511655857-d19b40a7a54e"), historia: "Entregue por uma família que se mudou para o exterior.", comportamento: "Tranquila e grudada nos tutores.", observacoes_extras: "Ronca bastante e não gosta de calor." },
  { nome: "Mel", tipo: "Cachorro", raca: "Pug", cor: "Preto", porte: "P", sexo: "F", idade_meses: 60, chegou: 90, foto_url: foto("photo-1517849845537-4d257902454a"), historia: "Dorminhoca e super companheira.", comportamento: "Calma, ideal para quem passa o dia em casa." },
  { nome: "Bidu", tipo: "Cachorro", raca: SRD, cor: "Branco", porte: "P", sexo: "M", idade_meses: 15, chegou: 35, foto_url: foto("photo-1561037404-61cd46aa615b"), historia: "Encontrado sozinho numa praça do Benfica.", comportamento: "Esperto, aprende truques rápido." },
  { nome: "Pipoca", tipo: "Cachorro", raca: SRD, cor: "Caramelo", porte: "P", sexo: "F", idade_meses: 4, chegou: 12, foto_url: foto("photo-1537151608828-ea2b11777ee8"), historia: "Nasceu na ONG, filha de uma cadela resgatada.", comportamento: "Filhote curiosa, morde tudo o que vê.", observacoes_extras: "Falta a segunda dose da V10." },
  { nome: "Nina", tipo: "Cachorro", raca: "Poodle", cor: "Branco", porte: "P", sexo: "F", idade_meses: 72, chegou: 190, foto_url: foto("photo-1534361960057-19889db9621e"), historia: "Viveu anos com uma senhora que faleceu.", comportamento: "Carinhosa, prefere ambientes calmos." },
  { nome: "Max", tipo: "Cachorro", raca: "Golden Retriever", cor: "Dourado", porte: "G", sexo: "M", idade_meses: 30, chegou: 180, foto_url: foto("photo-1558788353-f76d92427f16"), historia: "Resgatado de um canil clandestino.", comportamento: "Dócil, ótimo com crianças." },
  { nome: "Cacau", tipo: "Cachorro", raca: SRD, cor: "Caramelo", porte: "M", sexo: "F", idade_meses: 11, chegou: 8, foto_url: foto("photo-1530281700549-e82e7bf110d6"), historia: "Resgatada na praia do Futuro durante uma chuva forte.", comportamento: "Ama correr e nadar." },
  { nome: "Amendoim", tipo: "Cachorro", raca: "Labrador Retriever", cor: "Creme", porte: "M", sexo: "M", idade_meses: 4, chegou: 30, foto_url: foto("photo-1507146426996-ef05306b995a"), historia: "Filhote de uma ninhada de oito irmãos.", comportamento: "Muito brincalhão, precisa de espaço." },
  { nome: "Pingo", tipo: "Cachorro", raca: SRD, cor: "Branco", porte: "M", sexo: "M", idade_meses: 26, chegou: 75, foto_url: foto("photo-1477884213360-7e9d7dcc1e48"), historia: "Vivia na rua perto de um posto de gasolina.", comportamento: "Desconfiado no começo, depois não larga mais." },
  { nome: "Zeus", tipo: "Cachorro", raca: "Labrador Retriever", cor: "Chocolate", porte: "G", sexo: "M", idade_meses: 48, chegou: 65, foto_url: foto("photo-1518717758536-85ae29035b6d"), historia: "Entregue por um tutor que não podia mais cuidar dele.", comportamento: "Comilão e muito obediente." },
  { nome: "Jade", tipo: "Cachorro", raca: "Cocker Spaniel", cor: "Caramelo", porte: "M", sexo: "F", idade_meses: 28, chegou: 110, foto_url: foto("photo-1544568100-847a948585b9"), historia: "Resgatada com otite grave, hoje está curada.", comportamento: "Alegre e sociável.", observacoes_extras: "Limpar as orelhas toda semana." },
  { nome: "Belinha", tipo: "Cachorro", raca: SRD, cor: "Branco", porte: "P", sexo: "F", idade_meses: 96, chegou: 150, foto_url: foto("photo-1588943211346-0908a1fb0b01"), historia: "Idosa resgatada de um abrigo superlotado.", comportamento: "Tranquila, gosta de colo e de sol.", observacoes_extras: "Toma remédio para o coração uma vez por dia." },
  { nome: "Bolota", tipo: "Cachorro", raca: "Golden Retriever", cor: "Creme", porte: "M", sexo: "M", idade_meses: 3, chegou: 5, foto_url: foto("photo-1591160690555-5debfba289f0"), historia: "O caçula da ONG, chegou semana passada.", comportamento: "Dorme metade do dia e brinca na outra metade." },
  { nome: "Luke", tipo: "Cachorro", raca: "Siberian Husky", cor: "Cinza", porte: "G", sexo: "M", idade_meses: 26, chegou: 45, foto_url: foto("photo-1605568427561-40dd23c2acea"), historia: "Abandonado por não se adaptar a um apartamento.", comportamento: "Muito ativo, uiva quando fica sozinho.", observacoes_extras: "Precisa de casa com quintal e passeios longos." },
  { nome: "Fubá", tipo: "Cachorro", raca: SRD, cor: "Caramelo", porte: "P", sexo: "M", idade_meses: 40, chegou: 80, foto_url: foto("photo-1600077106724-946750eeaf3c"), historia: "O clássico caramelo brasileiro.", comportamento: "Fiel e protetor." },
  { nome: "Neve", tipo: "Cachorro", raca: "Outro", cor: "Branco", porte: "G", sexo: "F", idade_meses: 54, chegou: 25, foto_url: foto("photo-1596492784531-6e6eb5ea9993"), historia: "Samoieda resgatada de uma situação de maus-tratos.", comportamento: "Doce e paciente, solta muito pelo." },
  { nome: "Fred", tipo: "Cachorro", raca: "Border Collie", cor: "Preto", porte: "M", sexo: "M", idade_meses: 34, chegou: 50, foto_url: foto("photo-1503256207526-0d5d80fa2f47"), historia: "Trabalhava numa fazenda que foi vendida.", comportamento: "Inteligentíssimo, precisa de atividades." },
  { nome: "Toby", tipo: "Cachorro", raca: "Dachshund", cor: "Marrom", porte: "P", sexo: "M", idade_meses: 18, chegou: 55, foto_url: foto("photo-1535930891776-0c2dfb7fda1a"), historia: "Salsichinha encontrado numa feira livre.", comportamento: "Teimoso e engraçado." },
  { nome: "Amora", tipo: "Cachorro", raca: SRD, cor: "Preto", porte: "M", sexo: "F", idade_meses: null, chegou: 15, foto_url: null, historia: "Resgatada adulta, não sabemos a idade exata.", comportamento: "Calma com pessoas, ainda tímida com outros cães." },
  { nome: "Brutus", tipo: "Cachorro", raca: "Rottweiler", cor: "Preto", porte: "G", sexo: "M", idade_meses: 70, chegou: 100, foto_url: null, historia: "Grandão de coração mole.", comportamento: "Precisa de tutor experiente.", observacoes_extras: "Não convive com gatos." },
  { nome: "Duque", tipo: "Cachorro", raca: "Pastor Alemão", cor: "Marrom", porte: "G", sexo: "M", idade_meses: 60, chegou: 20, foto_url: null, historia: "Aposentado de uma empresa de segurança.", comportamento: "Obediente e protetor.",
    arquivado: [4, "Transferido para a ONG parceira de Sobral, que tem espaço para cães grandes."] },

  // ---------- gatos ----------
  { nome: "Frajola", tipo: "Gato", raca: SRD, cor: "Preto", porte: "M", sexo: "M", idade_meses: 24, chegou: 70, foto_url: foto("photo-1514888286974-6c03e2ca1dba"), historia: "Independente, mas não dispensa um cafuné.", comportamento: "Convive bem com outros gatos." },
  { nome: "Mia", tipo: "Gato", raca: "American Shorthair", cor: "Cinza", porte: "M", sexo: "F", idade_meses: 48, chegou: 120, foto_url: foto("photo-1574158622682-e40e69881006"), historia: "Tranquila, perfeita para apartamento.", comportamento: "Independente e silenciosa." },
  { nome: "Zorro", tipo: "Gato", raca: "Maine Coon", cor: "Laranja", porte: "G", sexo: "M", idade_meses: 38, chegou: 40, foto_url: foto("photo-1573865526739-10659fec78a5"), historia: "Gigante gentil entregue por uma família com alergia.", comportamento: "Segue os tutores pela casa como um cachorro." },
  { nome: "Simba", tipo: "Gato", raca: SRD, cor: "Laranja", porte: "P", sexo: "M", idade_meses: 10, chegou: 60, foto_url: foto("photo-1596854407944-bf87f6fdd49e"), historia: "Filhote aventureiro e brincalhão.", comportamento: "Muito ativo, adora brinquedos." },
  { nome: "Félix", tipo: "Gato", raca: SRD, cor: "Cinza", porte: "P", sexo: "M", idade_meses: 16, chegou: 140, foto_url: foto("photo-1495360010541-f48722b34f7d"), historia: "Resgatado de dentro de um motor de carro.", comportamento: "Curioso e falante." },
  { nome: "Cleo", tipo: "Gato", raca: SRD, cor: "Branco", porte: "M", sexo: "F", idade_meses: 25, chegou: 55, foto_url: foto("photo-1526336024174-e58f5cdd8e13"), historia: "Tricolor resgatada num terreno baldio.", comportamento: "Brincalhona e muito vocal." },
  { nome: "Nala", tipo: "Gato", raca: "Persa", cor: "Creme", porte: "M", sexo: "F", idade_meses: 36, chegou: 70, foto_url: foto("photo-1513245543132-31f507417b26"), historia: "Retirada de um criadouro irregular.", comportamento: "Calma e preguiçosa.", observacoes_extras: "Precisa de escovação diária." },
  { nome: "Bolinha", tipo: "Gato", raca: SRD, cor: "Cinza", porte: "M", sexo: "M", idade_meses: 13, chegou: 30, foto_url: foto("photo-1518791841217-8f162f1e1131"), historia: "Chegou magrinho e hoje faz jus ao nome.", comportamento: "Dorminhoco e carinhoso." },
  { nome: "Luna", tipo: "Gato", raca: SRD, cor: "Cinza", porte: "P", sexo: "F", idade_meses: 12, chegou: 45, foto_url: foto("photo-1543852786-1cf6624b9987"), historia: "Carinhosa e curiosa, ama um sofá.", comportamento: "Tranquila, gosta de colo." },
  { nome: "Mimi", tipo: "Gato", raca: SRD, cor: "Creme", porte: "P", sexo: "F", idade_meses: 3, chegou: 20, foto_url: foto("photo-1592194996308-7b43878e84a6"), historia: "Encontrada numa caixa de papelão com os irmãos.", comportamento: "Brincalhona, escala tudo." },
  { nome: "Tom", tipo: "Gato", raca: "Scottish Fold", cor: "Cinza", porte: "M", sexo: "M", idade_meses: 44, chegou: 35, foto_url: foto("photo-1533738363-b7f9aef128ce"), historia: "O gato mais estiloso da ONG.", comportamento: "Tranquilo, observa tudo de longe." },
  { nome: "Garfield", tipo: "Gato", raca: SRD, cor: "Laranja", porte: "G", sexo: "M", idade_meses: 50, chegou: 160, foto_url: foto("photo-1519052537078-e6302a4968d4"), historia: "Gordinho que ama dormir no sol.", comportamento: "Preguiçoso e muito dócil.", observacoes_extras: "Está em dieta controlada." },
  { nome: "Tigrinho", tipo: "Gato", raca: SRD, cor: "Cinza", porte: "P", sexo: "M", idade_meses: 3, chegou: 10, foto_url: foto("photo-1529778873920-4da4926a72c2"), historia: "Filhote rajado resgatado de um bueiro.", comportamento: "Assustado no começo, já está pegando confiança." },
  { nome: "Branquinha", tipo: "Gato", raca: "Angorá", cor: "Branco", porte: "P", sexo: "F", idade_meses: 30, chegou: 50, foto_url: foto("photo-1606214174585-fe31582dc6ee"), historia: "Surda de nascença, comum em gatos brancos de olhos azuis.", comportamento: "Muito carinhosa.", observacoes_extras: "Deve viver só dentro de casa." },
  { nome: "Pantera", tipo: "Gato", raca: SRD, cor: "Preto", porte: "P", sexo: "F", idade_meses: null, chegou: 7, foto_url: null, historia: "Resgatada adulta, ainda muito arisca.", comportamento: "Precisa de paciência para se adaptar." },
];

const buscarId = async (tabela, nome) => {
  const [registro] = await AppDataSource.query(`SELECT id FROM ${tabela} WHERE nome = $1`, [nome]);
  if (!registro) throw new Error(`"${nome}" não encontrado em ${tabela}. Rode as seeds de tipos, raças e cores antes.`);
  return registro.id;
};

export const seedPets = async () => {
  try {
    await AppDataSource.initialize();

    for (const pet of [...petsIniciais, ...petsExtras]) {
      const [existente] = await AppDataSource.query(`SELECT id FROM pets WHERE nome = $1`, [pet.nome]);
      if (existente) continue;

      await AppDataSource.query(
        `INSERT INTO pets
          (nome, tipo_id, raca_id, cor_id, porte, sexo, idade_meses, historia, comportamento, observacoes_extras, foto_url,
           arquivado_em, motivo_arquivamento, criado_em, atualizado_em)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
           NOW() - make_interval(days => $13), $14, NOW() - make_interval(days => $12), NOW() - make_interval(days => $12))`,
        [
          pet.nome,
          await buscarId("tipos", pet.tipo),
          await buscarId("racas", pet.raca),
          await buscarId("cores", pet.cor),
          pet.porte,
          pet.sexo,
          pet.idade_meses,
          pet.historia,
          pet.comportamento ?? null,
          pet.observacoes_extras ?? null,
          pet.foto_url,
          pet.chegou,
          pet.arquivado?.[0] ?? null, // make_interval com NULL dá NULL: pet não arquivado
          pet.arquivado?.[1] ?? null,
        ],
      );
    }

    const [{ total }] = await AppDataSource.query(`SELECT COUNT(*)::int AS total FROM pets`);

    console.log(`Seed de pets concluída. Total de registros: ${total}`);
  } catch (error) {
    console.error("Erro ao criar seed de pets:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};
