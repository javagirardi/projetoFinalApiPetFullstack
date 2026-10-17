import test from "node:test";
import assert from "node:assert/strict";
import { criarBancoTeste } from "./helpers/database.js";
import { criarSeguranca } from "../src/auth/security.js";
import { criarRepositorioAuth } from "../src/auth/repository.js";
import { criarApp } from "../src/app.js";

test("módulos 2 e 3 funcionam por HTTP com entidades, transações e consultas reais", async (t) => {
  const banco = await criarBancoTeste();
  const config = { authSecret: "segredo-de-testes-com-mais-de-32-caracteres", frontendOrigin: "http://localhost:5173" };
  const seguranca = criarSeguranca(config), ds = banco.dataSource;
  const app = criarApp({ config, seguranca, dataSource: ds, repositorioAuth: criarRepositorioAuth(ds), verificarBanco: () => ds.query("SELECT 1") });
  const server = app.listen(0, "127.0.0.1");
  try {
    await new Promise((resolve, reject) => { server.once("listening", resolve); server.once("error", reject); });
    const base = `http://127.0.0.1:${server.address().port}`;
    async function request(path, { method = "GET", body, token } = {}) {
      const response = await fetch(base + path, { method, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
      return { status: response.status, body: await response.json() };
    }
    const hash = await seguranca.hashSenha("senha123");
    const equipe = await ds.getRepository("Usuario").save({ nome: "Equipe", email: "equipe@example.com", senha_hash: hash });
    const tokenEquipe = seguranca.gerarToken({ ...equipe, role: "admin" });
    const cadastro = { nome: "Lar de teste", email: "lar@example.com", telefone: "(85) 99999-9999", cep: "60160-230", estado: "CE", cidade: "Fortaleza", bairro: "Bairro", rua: "Rua de teste", numero: "1", moradia: "CASA_QUINTAL", moradores: 2, outros_animais: false, senha: "senha123" };
    let lar, tokenLar, outroLar, tokenOutro, pet;
    await t.test("cadastro valida campos, normaliza e-mail e não retorna senha", async () => {
      const invalido = await request("/lares-adotivos", { method: "POST", body: { ...cadastro, moradores: 0, outros_animais: "false", estado: "XX" } });
      assert.equal(invalido.status, 400); assert.ok(invalido.body.erros.moradores); assert.ok(invalido.body.erros.outros_animais);
      const criado = await request("/lares-adotivos", { method: "POST", body: { ...cadastro, email: " LAR@example.com ", confirmacao: "ignorada", termo: true } });
      assert.equal(criado.status, 201); lar = criado.body;
      assert.equal(lar.email, cadastro.email); assert.equal(JSON.stringify(lar).includes("senha"), false);
      const login = await request("/auth/login", { method: "POST", body: { email: cadastro.email, senha: cadastro.senha } });
      assert.equal(login.status, 200); tokenLar = login.body.token;
      const criadoOutro = await request("/lares-adotivos", { method: "POST", body: { ...cadastro, email: "outro@example.com" } });
      assert.equal(criadoOutro.status, 201); outroLar = criadoOutro.body;
      tokenOutro = seguranca.gerarToken({ ...outroLar, role: "lar" });
    });
    await t.test("cadastro rejeita e-mail de lar e equipe inclusive com diferença de caixa", async () => {
      for (const email of ["LAR@EXAMPLE.COM", "EQUIPE@EXAMPLE.COM"]) assert.equal((await request("/lares-adotivos", { method: "POST", body: { ...cadastro, email } })).status, 409);
    });
    await t.test("catálogos são públicos e pets são exclusivos da equipe", async () => {
      for (const [path, entity] of [["tipos", "Tipo"], ["racas", "Raca"], ["cores", "Cor"]]) {
        await ds.getRepository(entity).save({ nome: "Teste" });
        assert.equal((await request(`/${path}`)).body.length, 1);
      }
      assert.equal((await request("/pets")).status, 401);
      assert.equal((await request("/pets", { token: tokenLar })).status, 403);
      const criado = await request("/pets", { token: tokenEquipe, method: "POST", body: { nome: "Pet de teste", tipo_id: 1, raca_id: 1, cor_id: 1, porte: "P", idade_meses: 0, sexo: null } });
      assert.equal(criado.status, 201); pet = criado.body;
      assert.equal(pet.situacao, "DISPONIVEL"); assert.equal(pet.idade_meses, 0); assert.equal(pet.tipo.id, 1);
    });
    await t.test("validação recusa IDs inexistentes, opcionais inválidos e atualização vazia", async () => {
      const invalido = await request("/pets", { method: "POST", token: tokenEquipe, body: { nome: "Pet", tipo_id: 999, raca_id: 1, cor_id: 1, porte: "P", idade_meses: -1, foto_url: "javascript:alert(1)" } });
      assert.equal(invalido.status, 400); assert.ok(invalido.body.erros.tipo_id); assert.ok(invalido.body.erros.idade_meses); assert.ok(invalido.body.erros.foto_url);
      assert.equal((await request(`/pets/${pet.id}`, { method: "PUT", token: tokenEquipe, body: {} })).status, 400);
      assert.equal((await request("/admin/pets/999", { token: tokenEquipe })).status, 404);
    });
    await t.test("edição parcial preserva relações e arquivamento é reversível", async () => {
      const editado = await request(`/pets/${pet.id}`, { method: "PUT", token: tokenEquipe, body: { nome: "Novo nome" } });
      assert.equal(editado.status, 200); assert.equal(editado.body.tipo.id, 1); assert.equal(editado.body.raca.id, 1); assert.equal(editado.body.idade_meses, 0);
      const novaRaca = await ds.getRepository("Raca").save({ nome: "Outra raça" });
      const mudouRelacao = await request(`/pets/${pet.id}`, { method: "PUT", token: tokenEquipe, body: { raca_id: novaRaca.id } });
      assert.equal(mudouRelacao.status, 200); assert.equal(mudouRelacao.body.raca_id, novaRaca.id); assert.equal(mudouRelacao.body.raca.id, novaRaca.id); assert.equal(mudouRelacao.body.tipo_id, 1);
      assert.equal((await request(`/pets/${pet.id}/arquivar`, { method: "PATCH", token: tokenEquipe, body: {} })).status, 400);
      const arquivado = await request(`/pets/${pet.id}/arquivar`, { method: "PATCH", token: tokenEquipe, body: { motivo: "Transferido" } });
      assert.equal(arquivado.status, 200); assert.equal(arquivado.body.situacao, "ARQUIVADO");
      assert.equal((await request(`/pets/${pet.id}/arquivar`, { method: "PATCH", token: tokenEquipe, body: { motivo: "Outro" } })).status, 409);
      assert.equal((await request(`/pets/${pet.id}`, { method: "PUT", token: tokenEquipe, body: { historia: "História atualizada" } })).status, 200);
      const restaurado = await request(`/pets/${pet.id}/restaurar`, { method: "PATCH", token: tokenEquipe });
      assert.equal(restaurado.status, 200); assert.equal(restaurado.body.arquivado_em, null); assert.equal(restaurado.body.motivo_arquivamento, null);
      assert.equal(restaurado.body.situacao, "DISPONIVEL");
      assert.equal((await request(`/pets/${pet.id}/restaurar`, { method: "PATCH", token: tokenEquipe })).status, 409);
    });
    await t.test("minhas adoções isola lares, ordena histórico e mantém pets arquivados", async () => {
      const repo = ds.getRepository("Adocao");
      const pedido = await repo.save({ pet_id: pet.id, lar_adotivo_id: lar.id, motivo: "Um lar preparado para adotar", experiencia: "PRIMEIRO", tempo_sozinho: "ATE_4H", status: "CANCELADA" });
      const historico = ds.getRepository("AdocaoHistorico");
      await historico.save({ adocao_id: pedido.id, status: "CANCELADA", observacao: "A pedido do lar", criado_em: new Date("2026-10-17T15:00:00Z") });
      await historico.save({ adocao_id: pedido.id, status: "ANALISE", observacao: "Pedido enviado", criado_em: new Date("2026-10-16T15:00:00Z") });
      await request(`/pets/${pet.id}/arquivar`, { method: "PATCH", token: tokenEquipe, body: { motivo: "Transferido" } });
      assert.equal((await request("/minhas-adocoes")).status, 401);
      assert.equal((await request("/minhas-adocoes", { token: tokenEquipe })).status, 403);
      const meus = await request(`/minhas-adocoes?lar_adotivo_id=${outroLar.id}`, { token: tokenLar });
      assert.equal(meus.status, 200); assert.equal(meus.body.length, 1); assert.equal(meus.body[0].historico[0].status, "ANALISE"); assert.equal(meus.body[0].pet.id, pet.id);
      assert.equal((await request("/minhas-adocoes", { token: tokenOutro })).body.length, 0);
      await request(`/pets/${pet.id}/restaurar`, { method: "PATCH", token: tokenEquipe });
    });
    await t.test("situação e bloqueios de arquivamento respeitam pedidos e adoção concluída", async () => {
      const pedido = await ds.getRepository("Adocao").save({ pet_id: pet.id, lar_adotivo_id: outroLar.id, motivo: "Quero adotar este amigo", experiencia: "JA_TEVE", tempo_sozinho: "ATE_4H", status: "ANALISE" });
      for (const [status, situacao] of [["ANALISE", "EM_PROCESSO"], ["APROVADA", "RESERVADO"], ["CONCLUIDA", "ADOTADO"]]) {
        await ds.getRepository("Adocao").update(pedido.id, { status });
        const lista = await request("/pets", { token: tokenEquipe });
        assert.equal(lista.status, 200); assert.equal(lista.body[0].situacao, situacao);
        assert.equal(lista.body[0].pedidos_em_andamento, status === "CONCLUIDA" ? 0 : 1);
        if (status === "CONCLUIDA") assert.deepEqual(lista.body[0].adotado_por, { id: outroLar.id, nome: outroLar.nome });
        assert.equal(JSON.stringify(lista.body).includes("senha"), false);
        assert.equal((await request(`/pets/${pet.id}/arquivar`, { method: "PATCH", token: tokenEquipe, body: { motivo: "Transferido" } })).status, 409);
      }
    });
  } finally { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); await banco.close(); }
});
