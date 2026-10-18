import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import express from "express";
import { criarSeguranca } from "../src/auth/security.js";
import { criarApp } from "../src/app.js";
import { autenticar, exigirRole } from "../src/auth/middleware.js";
import { errorHandler } from "../src/http/errors.js";
import { carregarConfiguracao } from "../src/config/env.js";

const config = { authSecret: "segredo-de-teste-com-mais-de-32-caracteres", frontendOrigin: "http://localhost:5173" };
const seguranca = criarSeguranca(config);
const usuario = { id: 1, nome: "Teste", email: "teste@example.com", role: "lar" };

async function servir(app, tarefa) {
  const server = app.listen(0, "127.0.0.1");
  try {
    await new Promise((resolve, reject) => { server.once("listening", resolve); server.once("error", reject); });
    await tarefa(`http://127.0.0.1:${server.address().port}`);
  } finally { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
}

test("configuração exige segredo e dados do banco; não oferece senha padrão", () => {
  assert.throws(() => carregarConfiguracao({}), /AUTH_SECRET/);
  assert.throws(() => carregarConfiguracao({ AUTH_SECRET: config.authSecret }), /DB_NAME/);
  assert.equal(carregarConfiguracao({ AUTH_SECRET: config.authSecret, DB_NAME: "teste", DB_USER: "teste", DB_PASSWORD: "teste" }).porta, 8888);
  const oficial = carregarConfiguracao({ PORT: "9000", JWT_SECRET: config.authSecret, JWT_EXPIRES_IN: "12h", DB_NAME: "teste", DB_USERNAME: "teste", DB_PASSWORD: "teste", DB_LOGGING: "true" });
  assert.equal(oficial.porta, 9000); assert.equal(oficial.authSecret, config.authSecret); assert.equal(oficial.database.username, "teste"); assert.equal(oficial.database.logging, true);
});

test("bcrypt valida senha e rejeita hashes da etapa anterior", async () => {
  const hash = await seguranca.hashSenha("senha-teste");
  assert.match(hash, /^\$2/);
  assert.equal(await seguranca.compararSenha("senha-teste", hash), true);
  assert.equal(await seguranca.compararSenha("outra", hash), false);
  assert.equal(await seguranca.compararSenha("senha-teste", "hash-sha256-antigo"), false);
});

test("JWT rejeita expiração, assinatura alterada, identidade inconsistente e token malformado", () => {
  const token = seguranca.gerarToken(usuario);
  assert.deepEqual(seguranca.validarToken(token), usuario);
  assert.notEqual(seguranca.gerarToken(usuario), token, "Logins sucessivos têm tokens distintos, mesmo no mesmo segundo.");
  const expirado = criarSeguranca({ ...config, authExpiresIn: -1 }).gerarToken(usuario);
  const incoerente = jwt.sign(usuario, config.authSecret, { expiresIn: "1h", issuer: "lab365petamigo", audience: "lab365petamigo-web", subject: "EQUIPE:1" });
  for (const invalido of [expirado, incoerente, token + "x", "abc.def.ghi", null]) assert.equal(seguranca.validarToken(invalido), null);
});

test("login de ambos os perfis normaliza e-mail e não expõe hash", async () => {
  const hash = await seguranca.hashSenha("senha-teste");
  for (const role of ["lar", "admin"]) {
    const app = criarApp({ config, seguranca, verificarBanco: async () => {}, repositorioAuth: { buscarPorEmail: async (email) => {
      assert.equal(email, "teste@example.com"); return { ...usuario, role, senha_hash: hash };
    } } });
    await servir(app, async (url) => {
      const response = await fetch(`${url}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: " TESTE@example.com ", senha: "senha-teste" }) });
      assert.equal(response.status, 200);
      const body = await response.json();
      assert.deepEqual(Object.keys(body), ["id", "nome", "email", "role", "token"]);
      assert.equal(seguranca.validarToken(body.token).role, role);
    });
  }
});

test("API retorna erros de campo, credenciais inválidas, JSON inválido e readiness indisponível", async () => {
  const app = criarApp({ config, seguranca, repositorioAuth: { buscarPorEmail: async () => null }, verificarBanco: async () => { throw new Error("offline"); } });
  await servir(app, async (url) => {
    const post = (body) => fetch(`${url}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    const invalid = await post("{}"); assert.equal(invalid.status, 400); assert.deepEqual(Object.keys((await invalid.json()).erros), ["email", "senha"]);
    assert.equal((await post(JSON.stringify({ email: usuario.email, senha: "errada" }))).status, 401);
    assert.equal((await post("{invalido")).status, 400);
    assert.equal((await fetch(`${url}/health`)).status, 200);
    assert.equal((await fetch(`${url}/health/ready`)).status, 503);
  });
});

test("middleware distingue token ausente, perfil errado e acesso autorizado", async () => {
  const app = express();
  app.get("/equipe", autenticar(seguranca), exigirRole("admin"), (req, res) => res.json(req.usuario));
  app.use(errorHandler);
  await servir(app, async (url) => {
    assert.equal((await fetch(`${url}/equipe`)).status, 401);
    assert.equal((await fetch(`${url}/equipe`, { headers: { Authorization: `Bearer ${seguranca.gerarToken(usuario)}` } })).status, 403);
    assert.equal((await fetch(`${url}/equipe`, { headers: { Authorization: `Bearer ${seguranca.gerarToken({ ...usuario, role: "admin" })}` } })).status, 200);
  });
});
