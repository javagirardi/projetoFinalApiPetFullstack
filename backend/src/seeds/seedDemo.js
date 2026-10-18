import dataSource from "../config/database.js";
import { carregarConfiguracao } from "../config/env.js";
import { criarSeguranca } from "../auth/security.js";

const config = carregarConfiguracao();
if (config.database.database !== "lab365petamigo_modulo4" || process.env.NODE_ENV === "production") throw new Error("Demonstração permitida apenas no banco local da nova etapa.");
const seguranca = criarSeguranca(config);
const emailLar = "demo.lar@lab365petamigo.example", emailEquipe = "demo.equipe@lab365petamigo.example";
try {
  await dataSource.initialize();
  await dataSource.transaction(async (manager) => {
    const usuarios = manager.getRepository("Usuario"), lares = manager.getRepository("LarAdotivo");
    for (const email of [emailLar, emailEquipe].sort()) await manager.query("SELECT pg_advisory_xact_lock(hashtext($1))", [email]);
    if (await usuarios.existsBy({ email: emailLar }) || await lares.existsBy({ email: emailEquipe })) throw new Error("Um e-mail demonstrativo está em uso por outro perfil.");
    if (!(await usuarios.existsBy({ email: emailEquipe }))) await usuarios.save({ nome: "Equipe de demonstração", email: emailEquipe, senha_hash: await seguranca.hashSenha("DemoEquipe123!"), ativo: true });
    let lar = await lares.findOneBy({ email: emailLar });
    if (!lar) lar = await lares.save({ nome: "Lar de demonstração", email: emailLar, telefone: "(00) 00000-0000", cep: "00000-000", estado: "SC", cidade: "Cidade de exemplo", bairro: "Bairro de exemplo", rua: "Rua de exemplo", numero: "1", moradia: "CASA_QUINTAL", moradores: 2, outros_animais: false, senha_hash: await seguranca.hashSenha("DemoLar123!") });
    const tipo = await manager.getRepository("Tipo").findOne({ order: { id: "ASC" }, where: {} });
    const raca = await manager.getRepository("Raca").findOne({ order: { id: "ASC" }, where: {} });
    const cor = await manager.getRepository("Cor").findOne({ order: { id: "ASC" }, where: {} });
    if (!tipo || !raca || !cor) throw new Error("Execute npm run db:seed antes da demonstração.");
    const marcador = "Cadastro fictício para demonstração dos módulos 2 e 3.";
    const fixtures = [
      ["Amora", null, "photo-1548199973-03cce0bbc87b"],
      ["Bento", "ANALISE", "photo-1505628346881-b72b27e84530"],
      ["Cacau", "APROVADA", "photo-1552053831-71594a27632d"],
      ["Dora", "CONCLUIDA", "photo-1477884213360-7e9d7dcc1e48"],
      ["Estrela", "RECUSADA", "photo-1568393691622-c7ba131d63b4"],
      ["Fubá", "CANCELADA", "photo-1605568427561-40dd23c2acea"],
      ["Guri", "ENTREVISTA", "photo-1530281700549-e82e7bf110d6"],
    ];
    for (const [nome, status, foto] of fixtures) {
      const pets = manager.getRepository("Pet");
      const foto_url = `https://images.unsplash.com/${foto}?w=400`;
      const existente = await pets.findOne({ where: { nome, historia: marcador }, select: { id: true, foto_url: true } });
      if (existente) {
        // Preenche só a foto ausente do exemplo, preservando alterações do usuário.
        await pets.createQueryBuilder().update().set({ foto_url }).where("id = :id AND (foto_url IS NULL OR foto_url = '')", { id: existente.id }).execute();
        continue;
      }
      const arquivado = nome === "Fubá";
      const pet = await pets.save({ nome, historia: marcador, tipo, raca, cor, foto_url, porte: "M", idade_meses: 18,
        ...(arquivado ? { arquivado_em: new Date(), motivo_arquivamento: "Transferido para outra ONG — exemplo demonstrativo." } : {}) });
      if (!status) continue;
      const fluxo = status === "CONCLUIDA" ? ["ANALISE", "ENTREVISTA", "APROVADA", "CONCLUIDA"] : status === "APROVADA" ? ["ANALISE", "ENTREVISTA", "APROVADA"] : status === "ANALISE" ? ["ANALISE"] : ["ANALISE", status];
      const adocao = await manager.getRepository("Adocao").save({ pet_id: pet.id, lar_adotivo_id: lar.id, status, motivo: "Quero oferecer um lar preparado para este pet.", experiencia: "JA_TEVE", tempo_sozinho: "ATE_4H", criado_em: new Date(Date.now() - fluxo.length * 86400000), atualizado_em: new Date(Date.now() - 86400000) });
      for (let i = 0; i < fluxo.length; i++) {
        const etapa = fluxo[i];
        await manager.getRepository("AdocaoHistorico").save({ adocao_id: adocao.id, status: etapa, usuario_id: null,
          observacao: etapa === "ANALISE" ? "Pedido enviado pelo lar." : etapa === "RECUSADA" ? "Outro lar apresentou condições mais adequadas — exemplo." : etapa === "CANCELADA" ? "Cancelado a pedido do lar — exemplo." : "Etapa registrada para demonstração.",
          criado_em: new Date(Date.now() - (fluxo.length - i) * 86400000) });
      }
    }
    // Corrige apenas datas inconsistentes dos exemplos criados pela primeira versão do seed.
    await manager.query(`UPDATE adocoes a SET criado_em = h.inicio, atualizado_em = h.fim
      FROM (SELECT adocao_id, min(criado_em) AS inicio, max(criado_em) AS fim FROM adocoes_historico GROUP BY adocao_id) h, pets p
      WHERE a.id = h.adocao_id AND a.pet_id = p.id AND p.historia = $1 AND a.lar_adotivo_id = $2 AND a.criado_em > h.inicio`, [marcador, lar.id]);
  });
  console.log("Demonstração preparada. Contas e pets já existentes foram preservados. Consulte docs/DEMONSTRACAO.md.");
} catch (error) { console.error("Falha na demonstração:", error.code || error.message); process.exitCode = 1; }
finally { if (dataSource.isInitialized) await dataSource.destroy(); }
