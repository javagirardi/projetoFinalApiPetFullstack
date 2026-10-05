import { BAD_REQUEST_STATUS } from "../constants/server.js";

export const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

export const textoPreenchido = (valor) =>
  typeof valor === "string" && valor.trim().length > 0;

// Aceita 3 ou "3"; devolve NaN para qualquer coisa que não seja um inteiro
export function paraInteiro(valor) {
  if (valor === null || valor === "" || typeof valor === "boolean") return NaN;
  const numero = Number(valor);
  return Number.isInteger(numero) ? numero : NaN;
}

export const foiEnviado = (dados, campo) => dados[campo] !== undefined;

// Resposta padrão de validação: a primeira mensagem em "error" e todas em "campos",
// para o front-end conseguir mostrar o erro embaixo de cada campo.
export function responderErros(response, campos) {
  return response
    .status(BAD_REQUEST_STATUS)
    .send({ error: Object.values(campos)[0], campos });
}
