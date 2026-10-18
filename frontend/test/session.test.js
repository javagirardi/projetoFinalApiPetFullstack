import test from "node:test";
import assert from "node:assert/strict";
import { criarArmazenamentoSessao, SESSION_KEY } from "../src/auth/session.js";
import { criarClienteApi, ApiError } from "../src/services/client.js";

function armazenamento() {
  const dados = new Map();
  return { getItem: (key) => dados.get(key) ?? null, setItem: (key, value) => dados.set(key, value), removeItem: (key) => dados.delete(key) };
}
const sessao = (token = "token") => ({ token, usuario: { id: 1, nome: "Lar", email: "lar@example.com", role: "lar", senha_hash: "nao-persistir" } });

test("sessão ignora armazenamento corrompido e persiste apenas o DTO público", () => {
  const storage = armazenamento();
  const store = criarArmazenamentoSessao(storage);
  storage.setItem(SESSION_KEY, "{invalido");
  assert.equal(store.ler(), null);
  store.salvar(sessao());
  assert.equal(storage.getItem(SESSION_KEY).includes("senha_hash"), false);
  assert.equal(JSON.parse(storage.getItem(SESSION_KEY)).role, "lar");
  assert.equal(Object.hasOwn(JSON.parse(storage.getItem(SESSION_KEY)), "usuario"), false);
  assert.equal(store.ler().usuario.role, "lar");
  store.limpar();
  assert.equal(store.ler(), null);
});

test("sessão e erros são consumidos no formato do template oficial", async () => {
  const storage = armazenamento(), store = criarArmazenamentoSessao(storage);
  store.salvar({ id: 8, nome: "Equipe", email: "equipe@example.com", role: "admin", token: "oficial" });
  assert.deepEqual(store.ler().usuario, { id: 8, nome: "Equipe", email: "equipe@example.com", role: "admin" });
  assert.equal(JSON.parse(storage.getItem("@dadoslogin")).token, "oficial");
  const api = criarClienteApi({ sessaoStore: store, fetchFn: async () => Response.json({ error: "Conflito", campos: { motivo: "Obrigatório" } }, { status: 409 }) });
  await assert.rejects(api("/pets/1/arquivar"), (error) => error.status === 409 && error.erros.motivo === "Obrigatório");
});

test("cliente envia Bearer e JSON; aceita resposta sem conteúdo", async () => {
  const store = criarArmazenamentoSessao(armazenamento()); store.salvar(sessao());
  const api = criarClienteApi({ sessaoStore: store, fetchFn: async (url, options) => {
    assert.equal(url, "/api/adocoes");
    assert.equal(options.headers.get("Authorization"), "Bearer token");
    assert.deepEqual(JSON.parse(options.body), { pet_id: 12 });
    return new Response(null, { status: 204 });
  } });
  assert.equal(await api("/adocoes", { method: "POST", body: { pet_id: 12 } }), null);
});

test("401 encerra sessão atual; 403 mantém a sessão e expõe erros de campo", async () => {
  const store = criarArmazenamentoSessao(armazenamento()); store.salvar(sessao());
  let status = 403;
  const api = criarClienteApi({ sessaoStore: store, fetchFn: async () => Response.json({ erro: "Negado", erros: { nome: "Obrigatório" } }, { status }) });
  await assert.rejects(api("/pets"), (error) => error instanceof ApiError && error.erros.nome === "Obrigatório");
  assert.ok(store.ler()); status = 401;
  await assert.rejects(api("/pets"), { status: 401 });
  assert.equal(store.ler(), null);
});

test("401 atrasado não remove sessão de um login novo", async () => {
  const store = criarArmazenamentoSessao(armazenamento()); store.salvar(sessao("antigo"));
  const api = criarClienteApi({ sessaoStore: store, fetchFn: async () => {
    store.salvar(sessao("novo")); return Response.json({ erro: "Expirado" }, { status: 401 });
  } });
  await assert.rejects(api("/minhas-adocoes"), { status: 401 });
  assert.equal(store.ler().token, "novo");
});
