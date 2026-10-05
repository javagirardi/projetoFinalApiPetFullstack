import { AppDataSource } from "../../config/database_postgres.js";

// Pedidos de exemplo espalhados pelos últimos 6 meses, cobrindo todos os casos do processo:
// adoções concluídas, pets reservados, entrevistas, pedidos em análise (alguns pets com
// vários lares interessados), recusas (inclusive automáticas) e cancelamentos (feitos pela
// equipe quando o adotante desiste pelo WhatsApp).
// Etapas: [status, dias atrás, observação]

const ENVIADO = "Pedido enviado pelo lar.";

// Caminho completo até a entrega, terminando "fim" dias atrás
const concluida = (fim, entrevista, aprovacao, entrega) => [
  ["ANALISE", fim + 12, ENVIADO],
  ["ENTREVISTA", fim + 8, entrevista],
  ["APROVADA", fim + 4, aprovacao],
  ["CONCLUIDA", fim, entrega],
];

const adocoesIniciais = [
  // ---------- adoções concluídas (alimentam o gráfico de adoções por mês) ----------
  { pet: "Nina", lar: "juliana@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "MAIS_8H", motivo: "Quero uma companheira para o meu apartamento.",
    etapas: [["ANALISE", 178, ENVIADO], ["RECUSADA", 172, "A Nina precisa de companhia durante o dia e a tutora passa mais de 8 horas fora."]] },
  { pet: "Nina", lar: "vone@lares.com", experiencia: "JA_TEVE", tempo_sozinho: "ATE_4H", motivo: "Sou aposentada e passo o dia em casa, a Nina vai ter muito colo.",
    etapas: concluida(165, "Visita à casa da Dona Neném.", "Casa tranquila, perfeita para uma cachorra idosa.", "Nina entregue com a ração especial.") },
  { pet: "Max", lar: "juliana@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "DE_4_A_8H", motivo: "Sempre quis um golden e agora trabalho meio período.",
    etapas: [["ANALISE", 160, ENVIADO], ["RECUSADA", 154, "Outro lar foi aprovado para este pet."]] },
  { pet: "Max", lar: "oliveira@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "Temos três crianças e um quintal enorme esperando o Max.",
    etapas: [["ANALISE", 162, ENVIADO], ["ENTREVISTA", 158, "Entrevista com toda a família por vídeo."], ["APROVADA", 154, "Família muito preparada."], ["CONCLUIDA", 150, "Max entregue, as crianças fizeram até cartaz."]] },
  { pet: "Lola", lar: "juliana@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "Mudei para meio período e agora consigo cuidar de uma cachorrinha.",
    etapas: concluida(135, "Entrevista por telefone.", "Rotina nova da tutora conferida.", "Lola entregue com a caminha dela.") },
  { pet: "Garfield", lar: "pedromarina@lares.com", experiencia: "PRIMEIRO", tempo_sozinho: "DE_4_A_8H", motivo: "Queremos adotar nosso primeiro gato.",
    etapas: [["ANALISE", 135, ENVIADO], ["CANCELADA", 132, "Cancelado a pedido do adotante, que avisou pelo WhatsApp."]] },
  { pet: "Garfield", lar: "recantobichos@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "Temos espaço e paciência para um gato idoso e gordinho.",
    etapas: concluida(120, "Entrevista por vídeo.", "Lar experiente com gatos.", "Garfield entregue com a dieta impressa.") },
  { pet: "Félix", lar: "pedromarina@lares.com", experiencia: "PRIMEIRO", tempo_sozinho: "DE_4_A_8H", motivo: "Depois de pensar melhor, achamos que um gato mais novo combina com a gente.",
    etapas: concluida(110, "Orientamos sobre telas nas janelas.", "Telas instaladas, enviaram fotos.", "Félix entregue.") },
  { pet: "Belinha", lar: "vone@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "A Nina se deu tão bem que queremos dar um lar para outra idosa.",
    etapas: concluida(95, "Lar já conhecido pela equipe.", "Aprovada sem ressalvas.", "Belinha entregue com o remédio do coração.") },
  { pet: "Thor", lar: "recanto@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "Temos quintal grande e crianças que adoram brincar com cachorros.",
    etapas: concluida(80, "Entrevista por vídeo realizada.", "Entrega combinada para o fim de semana.", "Thor entregue com a carteira de vacinação.") },
  { pet: "Jade", lar: "costa@lares.com", experiencia: "JA_TEVE", tempo_sozinho: "DE_4_A_8H", motivo: "Perdemos nossa cocker no ano passado e queremos dar amor a outra.",
    etapas: concluida(55, "Entrevista por vídeo (lar em Natal).", "Transporte combinado com voluntária.", "Jade entregue em Natal.") },
  { pet: "Mia", lar: "andrade@lares.com", experiencia: "JA_TEVE", tempo_sozinho: "DE_4_A_8H", motivo: "Moramos em apartamento e queremos uma gata tranquila como companhia.",
    etapas: concluida(40, "Entrevista presencial na ONG.", "Telas nas janelas conferidas.", "Mia entregue ao lar.") },
  { pet: "Nala", lar: "lima@lares.com", experiencia: "JA_TEVE", tempo_sozinho: "ATE_4H", motivo: "Temos experiência com gatos persas.",
    etapas: concluida(30, "Entrevista por vídeo.", "Lar experiente com a raça.", "Nala entregue com escova e shampoo.") },
  { pet: "Fubá", lar: "oliveira@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "O Max precisa de um irmão caramelo!",
    etapas: concluida(18, "Teste de convivência com o Max.", "Os dois se deram muito bem.", "Fubá entregue.") },
  { pet: "Simba", lar: "recanto@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "Queremos um filhote para crescer junto com os outros animais da casa.",
    etapas: concluida(10, "Entrevista por telefone.", "Aprovado: lar já conhecido pela equipe.", "Simba entregue ao lar.") },
  { pet: "Bidu", lar: "bemtevi@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "No sítio tem espaço de sobra para um cachorro esperto como o Bidu.",
    etapas: concluida(2, "Visita ao sítio em Maranguape.", "Sítio cercado e seguro.", "Bidu entregue, já fez amizade com os outros cães.") },

  // ---------- reservados (aprovados, aguardando a entrega) ----------
  { pet: "Zeus", lar: "rocha@lares.com", experiencia: "PRIMEIRO", tempo_sozinho: "DE_4_A_8H", motivo: "Queremos um cachorro grande para acompanhar a família.",
    etapas: [["ANALISE", 18, ENVIADO], ["RECUSADA", 4, "Outro lar foi aprovado para este pet."]] },
  { pet: "Zeus", lar: "raimundo@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "Moro perto da praia e o Zeus vai poder correr todo dia.",
    etapas: [["ANALISE", 20, ENVIADO], ["ENTREVISTA", 14, "Visita ao quintal em Aquiraz."], ["APROVADA", 4, "Entrega marcada para sábado às 9h."]] },
  { pet: "Tom", lar: "lima@lares.com", experiencia: "JA_TEVE", tempo_sozinho: "ATE_4H", motivo: "A Nala precisa de um amigo e o Tom tem o temperamento ideal.",
    etapas: [["ANALISE", 12, ENVIADO], ["ENTREVISTA", 8, "Conversa por vídeo com a família."], ["APROVADA", 2, "Aprovado, aguardando transporte para Teresina."]] },
  // a Ana Beatriz tem pedidos nas três etapas em andamento (Pérola aprovada, Mimi em entrevista, Pipoca em análise)
  { pet: "Pérola", lar: "anabeatriz@lares.com", experiencia: "PRIMEIRO", tempo_sozinho: "DE_4_A_8H", motivo: "Uma gata calma como a Pérola combina com meu apartamento tranquilo.",
    etapas: [["ANALISE", 15, ENVIADO], ["ENTREVISTA", 10, "Entrevista por vídeo, telas nas janelas conferidas."], ["APROVADA", 3, "Aprovada! Entrega combinada para domingo às 10h."]] },

  // ---------- aprovado e depois cancelado pela equipe ----------
  { pet: "Cleo", lar: "estudantes@lares.com", experiencia: "PRIMEIRO", tempo_sozinho: "MAIS_8H", motivo: "A república inteira quer uma gata!",
    etapas: [["ANALISE", 40, ENVIADO], ["ENTREVISTA", 35, "Entrevista com os quatro moradores."], ["APROVADA", 30, "Aprovado com orientação sobre rotina."], ["CANCELADA", 27, "O lar desistiu antes da entrega: dois moradores vão se mudar."]] },

  // ---------- entrevistas agendadas ----------
  { pet: "Bob", lar: "andrade@lares.com", experiencia: "JA_TEVE", tempo_sozinho: "DE_4_A_8H", motivo: "Queremos um companheiro para as caminhadas no fim de tarde.",
    etapas: [["ANALISE", 6, ENVIADO], ["ENTREVISTA", 3, "Entrevista por vídeo marcada para sexta às 15h."]] },
  { pet: "Luke", lar: "recantobichos@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "Temos um quintal grande e outro husky que precisa de companhia.",
    etapas: [["ANALISE", 9, ENVIADO], ["ENTREVISTA", 5, "Entrevista presencial na ONG, quinta às 10h."]] },
  { pet: "Mimi", lar: "anabeatriz@lares.com", experiencia: "PRIMEIRO", tempo_sozinho: "DE_4_A_8H", motivo: "Moro sozinha e quero uma gatinha para me fazer companhia.",
    etapas: [["ANALISE", 8, ENVIADO], ["ENTREVISTA", 2, "Entrevista por vídeo na segunda às 19h."]] },
  { pet: "Bolinha", lar: "cantinho@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "Nossa casa tem espaço e muito carinho para um gatinho dorminhoco.",
    etapas: [["ANALISE", 7, ENVIADO], ["ENTREVISTA", 4, "Vamos conferir se a casa tem telas nas janelas."]] },

  // ---------- em análise (a Pipoca tem três lares interessados) ----------
  { pet: "Bob", lar: "bemtevi@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "Temos um sítio com bastante espaço e outros cães para fazer companhia.",
    etapas: [["ANALISE", 2, ENVIADO]] },
  { pet: "Luna", lar: "bemtevi@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "As crianças sempre quiseram uma gatinha e temos tempo para cuidar dela.",
    etapas: [["ANALISE", 1, ENVIADO]] },
  { pet: "Pipoca", lar: "rocha@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "Já que o Zeus não deu certo, a Pipoca seria perfeita para nós.",
    etapas: [["ANALISE", 3, ENVIADO]] },
  { pet: "Pipoca", lar: "estudantes@lares.com", experiencia: "PRIMEIRO", tempo_sozinho: "DE_4_A_8H", motivo: "Agora que a república se reorganizou, queremos tentar de novo.",
    etapas: [["ANALISE", 2, ENVIADO]] },
  { pet: "Pipoca", lar: "anabeatriz@lares.com", experiencia: "PRIMEIRO", tempo_sozinho: "DE_4_A_8H", motivo: "Me apaixonei pela foto dela!",
    etapas: [["ANALISE", 1, ENVIADO]] },
  { pet: "Fred", lar: "oliveira@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "Fazemos trilha todo fim de semana e o Fred vai adorar.",
    etapas: [["ANALISE", 2, ENVIADO]] },
  { pet: "Cacau", lar: "pedromarina@lares.com", experiencia: "JA_TEVE", tempo_sozinho: "DE_4_A_8H", motivo: "O Félix é muito tranquilo e acho que vai gostar de uma cachorra.",
    etapas: [["ANALISE", 0, ENVIADO]] },
  { pet: "Luke", lar: "costa@lares.com", experiencia: "JA_TEVE", tempo_sozinho: "DE_4_A_8H", motivo: "A Jade precisa de um irmão grande.",
    etapas: [["ANALISE", 3, ENVIADO]] },

  // ---------- recusados e cancelados ----------
  { pet: "Brutus", lar: "estudantes@lares.com", experiencia: "PRIMEIRO", tempo_sozinho: "MAIS_8H", motivo: "Queremos um cão de guarda para o apartamento.",
    etapas: [["ANALISE", 50, ENVIADO], ["ENTREVISTA", 46, "Entrevista com os moradores."], ["RECUSADA", 44, "O Brutus precisa de tutor experiente e de espaço; apartamento com 4 moradores fora o dia todo não é indicado."]] },
  { pet: "Amendoim", lar: "vone@lares.com", experiencia: "TEM_OUTROS", tempo_sozinho: "ATE_4H", motivo: "As meninas iam adorar um filhote.",
    etapas: [["ANALISE", 25, ENVIADO], ["RECUSADA", 22, "Um filhote de labrador agitado não combina com duas cachorras idosas."]] },
  { pet: "Paçoca", lar: "andrade@lares.com", experiencia: "JA_TEVE", tempo_sozinho: "DE_4_A_8H", motivo: "A Mia está sozinha e pensamos em uma cachorrinha.",
    etapas: [["ANALISE", 15, ENVIADO], ["CANCELADA", 13, "Cancelado a pedido do adotante, que avisou pelo WhatsApp."]] },
  { pet: "Toby", lar: "lima@lares.com", experiencia: "JA_TEVE", tempo_sozinho: "ATE_4H", motivo: "Sempre gostei de salsichinhas.",
    etapas: [["ANALISE", 26, ENVIADO], ["ENTREVISTA", 23, "Entrevista por vídeo."], ["CANCELADA", 21, "Cancelado a pedido do adotante, que avisou pelo WhatsApp."]] },
];

// Data "N dias atrás", recuando alguns minutos para manter a ordem de eventos do mesmo dia
const dataAtras = (dias, minutos = 0) => new Date(Date.now() - dias * 86400000 - minutos * 60000);

export const seedAdocoes = async () => {
  try {
    await AppDataSource.initialize();

    const [{ total: existentes }] = await AppDataSource.query(`SELECT COUNT(*)::int AS total FROM adocoes`);
    if (existentes > 0) {
      console.log("Seed de adoções ignorada: já existem adoções cadastradas (use npm run db:resetar para recomeçar).");
      return;
    }

    const equipe = await AppDataSource.query(`SELECT id, email FROM usuarios ORDER BY id`);

    await AppDataSource.transaction(async (manager) => {
      const idPor = async (sql, valor) => (await manager.query(sql, [valor]))[0]?.id;
      const idLar = (email) => idPor(`SELECT id FROM lares_adotivos WHERE email = $1`, email);

      for (const [indice, adocao] of adocoesIniciais.entries()) {
        const petId = await idPor(`SELECT id FROM pets WHERE nome = $1`, adocao.pet);
        const larId = await idLar(adocao.lar);
        const [primeira, ultima] = [adocao.etapas[0], adocao.etapas.at(-1)];

        const [{ id }] = await manager.query(
          `INSERT INTO adocoes (pet_id, lar_adotivo_id, status, motivo, experiencia, tempo_sozinho, criado_em, atualizado_em)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
          [petId, larId, ultima[0], adocao.motivo, adocao.experiencia, adocao.tempo_sozinho, dataAtras(primeira[1]), dataAtras(ultima[1])],
        );

        for (const [ordem, [status, dias, observacao]] of adocao.etapas.entries()) {
          // a primeira etapa é o pedido enviado pelo lar no site; as demais são da equipe
          const usuarioId = ordem === 0 ? null : equipe[(indice + ordem) % equipe.length].id;
          await manager.query(
            `INSERT INTO adocoes_historico (adocao_id, status, observacao, usuario_id, criado_em) VALUES ($1, $2, $3, $4, $5)`,
            [id, status, observacao, usuarioId, dataAtras(dias, -ordem)],
          );
        }
      }
    });

    const [{ total }] = await AppDataSource.query(`SELECT COUNT(*)::int AS total FROM adocoes`);

    console.log(`Seed de adoções concluída. Total de registros: ${total}`);
  } catch (error) {
    console.error("Erro ao criar seed de adoções:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};
