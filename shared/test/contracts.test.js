import test from "node:test";
import assert from "node:assert/strict";
import { ROLE, calcularSituacaoPet, contarPedidosEmAndamento, destinoAposLogin, usuarioPublico, sessaoValida, contextoAutenticacao, navegacaoAposLogin } from "../src/index.js";

test("situação respeita precedência mesmo com pedidos simultâneos", () => {
  const pet = (status, extra = {}) => ({ adocoes: status.map((status) => ({ status })), ...extra });
  assert.equal(calcularSituacaoPet(pet([])), "DISPONIVEL");
  assert.equal(calcularSituacaoPet(pet(["RECUSADA", "CANCELADA"])), "DISPONIVEL");
  assert.equal(calcularSituacaoPet(pet(["ANALISE", "ENTREVISTA"])), "EM_PROCESSO");
  assert.equal(calcularSituacaoPet(pet(["ANALISE", "APROVADA"])), "RESERVADO");
  assert.equal(calcularSituacaoPet(pet(["APROVADA", "CONCLUIDA"])), "ADOTADO");
  assert.equal(calcularSituacaoPet(pet(["CONCLUIDA"], { arquivado_em: "2026-10-17" })), "ARQUIVADO");
  assert.equal(contarPedidosEmAndamento(pet(["ANALISE", "ENTREVISTA", "APROVADA", "CANCELADA"]).adocoes), 3);
});

test("retorno preserva intenção de adoção e restringe destinos por perfil", () => {
  assert.equal(destinoAposLogin(ROLE.LAR, "/pets/12?adotar=1"), "/pets/12?adotar=1");
  assert.equal(destinoAposLogin(ROLE.LAR, "/minhas-adocoes"), "/minhas-adocoes");
  assert.equal(destinoAposLogin(ROLE.EQUIPE, "/admin/pets"), "/admin/pets");
  assert.equal(destinoAposLogin(ROLE.EQUIPE, "/pets/12?adotar=1"), "/admin/processos");
  for (const destino of ["https://evil.test", "//evil.test", "/\\evil.test", "/%2f%2fevil.test", "/login", "/cadastro", "/admin/pets"]) {
    assert.equal(destinoAposLogin(ROLE.LAR, destino), "/pets");
  }
});

test("DTO público exclui credenciais e sessão rejeita perfil legado", () => {
  const usuario = { id: 1, nome: "Teste", email: "teste@example.com", role: ROLE.LAR, senha_hash: "segredo", senha: "segredo" };
  const publico = usuarioPublico(usuario);
  assert.deepEqual(Object.keys(publico), ["id", "nome", "email", "role"]);
  assert.equal(sessaoValida({ token: "token", usuario: publico }), true);
  assert.equal(sessaoValida({ token: "token", usuario: { ...publico, role: "ADMIN" } }), false);
  assert.equal(sessaoValida({ usuario: publico }), false);
});

test("retorno do requisito 2.1 atravessa login/cadastro e preserva petId", () => {
  const origem = { redirectTo: "/pets/12", petId: 12 };
  const cadastro = contextoAutenticacao(origem);
  const login = contextoAutenticacao({ ...cadastro, email: "lar@example.com", mensagem: "Cadastro concluído" });
  assert.deepEqual(navegacaoAposLogin(ROLE.LAR, login), { to: "/pets/12", state: { petId: 12 } });
  assert.deepEqual(contextoAutenticacao({}, "?retorno=%2Fpets%2F12&petId=12"), origem);
  assert.deepEqual(navegacaoAposLogin(ROLE.EQUIPE, login), { to: "/admin/processos", state: undefined });
  assert.deepEqual(navegacaoAposLogin(ROLE.LAR, contextoAutenticacao({ redirectTo: "https://evil.test", petId: 12 })), { to: "/pets", state: undefined });
  assert.equal(navegacaoAposLogin(ROLE.LAR, contextoAutenticacao({ redirectTo: "/pets/99", petId: 12 })).state, undefined);
});
