// Mais 10 cachorros e 10 gatos (20 no total), para o catálogo ficar bem variado.
// Cada linha: [nome, raça, cor, porte, sexo, idade em meses, id da foto no Unsplash].
// Foto null = sem foto (a vitrine mostra o emoji da espécie). As fotos foram conferidas uma a uma.
// História, comportamento e observações vêm das listas de cada espécie, em rodízio.

const foto = (id) => (id ? `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70` : null);
const SRD = "SRD (sem raça definida)";

const porTipo = {
  Cachorro: {
    pets: [
      ["Rex", "Bulldog Francês", "Bege", "P", "M", 30, "photo-1583512603805-3cc6b41f3edb"],
      ["Pandora", "Labrador Retriever", "Dourado", "M", "F", 5, "photo-1587764379873-97837921fd44"],
      ["Scooby", "Outro", "Caramelo", "G", "M", 50, "photo-1588269845464-8993565cac3a"],
      ["Kiara", SRD, "Branco", "P", "F", 6, "photo-1593134257782-e89567b7718a"],
      ["Chico", "Yorkshire Terrier", "Dourado", "P", "M", 4, "photo-1546527868-ccb7ee7dfa6a"],
      ["Princesa", "Outro", "Caramelo", "G", "F", 36, "photo-1505628346881-b72b27e84530"],
      ["Billy", "Pug", "Preto", "P", "M", 84, "photo-1517423440428-a5a00ad493e8"],
      ["Lua", "Outro", "Branco", "M", "F", 40, "photo-1529429617124-95b109e86bb8"],
      ["Marley", "Labrador Retriever", "Caramelo", "G", "M", 22, "photo-1586671267731-da2cf3ceeb80"],
      ["Pretinha", SRD, "Preto", "M", "F", 60, "photo-1604848698030-c434ba08ece1"],
    ],
    historias: [
      "Resgatado de um canil que fechou as portas.",
      "Encontrado amarrado num poste em dia de chuva.",
      "Entregue por uma família que se mudou para o exterior.",
      "Vivia nas ruas do Centro e foi acolhido por um comerciante.",
      "Nasceu na ONG, filho de uma cadela resgatada grávida.",
      "Abandonado em uma estrada e encontrado por voluntários.",
      "Veio de um acumulador junto com outros 20 cães.",
      "Entregue por um tutor idoso que não podia mais cuidar dele.",
      "Resgatado de uma enchente na periferia.",
      "Achado dentro de uma caixa na porta de uma clínica veterinária.",
    ],
    comportamentos: [
      "Brincalhão e cheio de energia.",
      "Calmo, adora deitar no pé do tutor.",
      "Sociável com outros cães e com crianças.",
      "Um pouco tímido no começo, depois muito carinhoso.",
      "Esperto, já sabe sentar e dar a pata.",
      "Ama passear e cheirar tudo pelo caminho.",
      "Protetor e atento a barulhos.",
      "Dorminhoco e companheiro.",
      "Agitado, precisa de espaço para gastar energia.",
      "Muito dócil, ótimo para quem nunca teve cachorro.",
    ],
    observacoes: ["Vacinado e vermifugado.", null, "Castrado.", null, "Precisa terminar o esquema de vacinas."],
  },

  Gato: {
    pets: [
      ["Mingau", SRD, "Cinza", "P", "M", 2, "photo-1574144611937-0df059b5ef3e"],
      ["Pérola", "Persa", "Branco", "M", "F", 30, "photo-1561948955-570b270e7c36"],
      ["Bartolomeu", "British Shorthair", "Cinza", "M", "M", 60, "photo-1548247416-ec66f4900b2e"],
      ["Fiapo", SRD, "Laranja", "M", "M", 20, "photo-1511044568932-338cba0ad803"],
      ["Kika", SRD, "Cinza", "P", "F", 14, "photo-1494256997604-768d1f608cac"],
      ["Nino", SRD, "Cinza", "P", "M", 18, "photo-1478098711619-5ab0b478d6e6"],
      ["Duquesa", "Ragdoll", "Creme", "M", "F", 42, "photo-1472491235688-bdc81a63246e"],
      ["Chiquinha", SRD, "Branco", "P", "F", 26, "photo-1513360371669-4adf3dd7dff8"],
      ["Romeu", SRD, "Laranja", "M", "M", 34, "photo-1596854273338-cbf078ec7071"],
      ["Malhada", SRD, "Branco", "M", "F", 22, "photo-1503777119540-ce54b422baff"],
    ],
    historias: [
      "Filhote encontrado num bueiro depois de uma chuva forte.",
      "Entregue por uma família com bebê a caminho.",
      "Vivia numa colônia de gatos de um condomínio.",
      "Resgatado do telhado de uma escola.",
      "Apareceu num restaurante e ficou por lá até ser resgatado.",
      "Encontrado dentro de um motor de carro.",
      "Veio de um criadouro irregular fechado pela fiscalização.",
      "Abandonado numa caixa de papelão na porta da ONG.",
      "Tutor faleceu e a família não pôde ficar com ele.",
      "Resgatado de uma obra abandonada.",
    ],
    comportamentos: [
      "Carinhoso, ronrona alto no colo.",
      "Independente, mas aparece na hora do lanche.",
      "Brincalhão, persegue qualquer bolinha.",
      "Tranquilo, perfeito para apartamento.",
      "Curioso, explora cada canto da casa.",
      "Falante, mia para conversar.",
      "Convive bem com outros gatos.",
      "Tímido no começo, depois não sai do lado.",
      "Dorminhoco, adora um sol na janela.",
      "Ativo à noite, adora arranhadores.",
    ],
    observacoes: ["Castrado e vacinado.", null, "Testado negativo para FIV e FeLV.", null],
  },

};

// Gera a lista final no mesmo formato de petsIniciais (pets.seed.js)
export const petsExtras = Object.entries(porTipo).flatMap(([tipo, dados], indiceTipo) =>
  dados.pets.map(([nome, raca, cor, porte, sexo, idade_meses, idFoto], i) => ({
    nome,
    tipo,
    raca,
    cor,
    porte,
    sexo,
    idade_meses,
    foto_url: foto(idFoto),
    historia: dados.historias[i % dados.historias.length],
    comportamento: dados.comportamentos[(i * 3 + 1) % dados.comportamentos.length],
    observacoes_extras: dados.observacoes[i % dados.observacoes.length] ?? null,
    chegou: 2 + ((i * 11 + indiceTipo * 7) % 150), // há quantos dias chegou na ONG
  })),
);
