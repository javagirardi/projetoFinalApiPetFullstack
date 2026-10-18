import test from "node:test";
import assert from "node:assert/strict";
import { validarLar, validarPet, validarMotivo } from "../src/index.js";

test("validação rejeita tipos incorretos e não envia confirmação/termo ao backend", () => {
  const { erros } = validarLar({ nome: "AB", telefone: 123, moradores: "1", outros_animais: "false", estado: "XX" });
  for (const field of ["nome", "telefone", "moradores", "outros_animais", "estado", "senha"]) assert.ok(erros[field]);
  assert.equal(Object.hasOwn(validarLar({ termo: true, confirmacao: "abc" }).dados, "termo"), false);
  assert.equal(Object.hasOwn(validarLar({ termo: true, confirmacao: "abc" }).dados, "confirmacao"), false);
});
test("validação parcial distingue omissão, null, zero e campo desconhecido", () => {
  assert.deepEqual(validarPet({ idade_meses: 0, sexo: null }, true).erros, {});
  assert.deepEqual(validarPet({ nome: "Novo" }, true).dados, { nome: "Novo" });
  assert.ok(validarPet({ desconhecido: "ignorar" }, true).erros.formulario);
  assert.ok(validarPet({ idade_meses: -1 }, true).erros.idade_meses);
  assert.ok(validarPet({ idade_meses: 1.5 }, true).erros.idade_meses);
  assert.ok(validarPet({ nome: null }, true).erros.nome);
  assert.ok(validarPet({ sexo: "X" }, true).erros.sexo);
  assert.ok(validarMotivo({ motivo: "   " }).erros.motivo);
});
