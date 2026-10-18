import { MORADIA, PORTE, SEXO } from "./index.js";
const UFS = new Set("AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" "));
const texto = (value) => typeof value === "string" ? value.trim() : value;
const objeto = (body) => body !== null && typeof body === "object" && !Array.isArray(body);

export function validarLar(body) {
  const erros = {};
  if (!objeto(body)) return { dados: {}, erros: { formulario: "Envie os campos do cadastro." } };
  const dados = {};
  for (const campo of ["nome", "email", "telefone", "cep", "rua", "numero", "bairro", "cidade", "estado", "moradia"]) dados[campo] = texto(body[campo]);
  dados.email = typeof dados.email === "string" ? dados.email.toLowerCase() : dados.email;
  dados.moradores = body.moradores;
  dados.outros_animais = body.outros_animais;
  dados.senha = body.senha;
  if (typeof dados.nome !== "string" || dados.nome.length < 3 || dados.nome.length > 100) erros.nome = "Informe um nome entre 3 e 100 caracteres.";
  if (typeof dados.email !== "string" || dados.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) erros.email = "Informe um e-mail válido.";
  if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(dados.telefone || "")) erros.telefone = "Use o formato (85) 99999-9999.";
  if (!/^\d{5}-\d{3}$/.test(dados.cep || "")) erros.cep = "Use o formato 00000-000.";
  for (const [campo, limite] of Object.entries({ rua: 150, numero: 30, bairro: 150, cidade: 100 })) {
    if (typeof dados[campo] !== "string" || !dados[campo] || dados[campo].length > limite) erros[campo] = `Preencha este campo com até ${limite} caracteres.`;
  }
  if (!UFS.has(dados.estado)) erros.estado = "Selecione uma UF válida.";
  if (!Object.values(MORADIA).includes(dados.moradia)) erros.moradia = "Selecione o tipo de moradia.";
  if (!Number.isInteger(dados.moradores) || dados.moradores < 1 || dados.moradores > 2147483647) erros.moradores = "Informe um número inteiro de moradores maior ou igual a 1.";
  if (typeof dados.outros_animais !== "boolean") erros.outros_animais = "Informe se possui outros animais.";
  if (typeof dados.senha !== "string" || dados.senha.length < 6 || new TextEncoder().encode(dados.senha).length > 72) erros.senha = "Use pelo menos 6 caracteres e no máximo 72 bytes na senha.";
  return { dados, erros };
}

export function validarPet(body, parcial = false) {
  const erros = {};
  const dados = {};
  if (!objeto(body)) return { dados, erros: { formulario: "Envie os campos do pet." } };
  const campos = ["nome", "tipo_id", "raca_id", "cor_id", "porte", "sexo", "idade_meses", "foto_url", "historia", "comportamento", "observacoes_extras"];
  for (const campo of campos) if (Object.hasOwn(body, campo)) dados[campo] = texto(body[campo]);
  if (parcial && !Object.keys(dados).length) erros.formulario = "Envie pelo menos um campo para atualizar.";
  if ((!parcial || Object.hasOwn(dados, "nome")) && (typeof dados.nome !== "string" || !dados.nome || dados.nome.length > 100)) erros.nome = "Informe o nome com até 100 caracteres.";
  for (const campo of ["tipo_id", "raca_id", "cor_id"]) {
    if ((!parcial || Object.hasOwn(dados, campo)) && (!Number.isSafeInteger(dados[campo]) || dados[campo] < 1 || dados[campo] > 2147483647)) erros[campo] = "Selecione uma opção válida.";
  }
  if ((!parcial || Object.hasOwn(dados, "porte")) && !Object.values(PORTE).includes(dados.porte)) erros.porte = "Selecione Pequeno, Médio ou Grande.";
  if (Object.hasOwn(dados, "sexo") && dados.sexo !== null && !Object.values(SEXO).includes(dados.sexo)) erros.sexo = "Selecione Macho, Fêmea ou Não informado.";
  if (Object.hasOwn(dados, "idade_meses") && dados.idade_meses !== null && (!Number.isInteger(dados.idade_meses) || dados.idade_meses < 0 || dados.idade_meses > 2147483647)) erros.idade_meses = "Informe uma idade inteira em meses, maior ou igual a zero.";
  for (const campo of ["foto_url", "historia", "comportamento", "observacoes_extras"]) {
    if (Object.hasOwn(dados, campo) && dados[campo] !== null && typeof dados[campo] !== "string") erros[campo] = "Informe um texto ou deixe vazio.";
  }
  if (typeof dados.foto_url === "string" && (dados.foto_url.length > 255 || !/^https?:\/\//i.test(dados.foto_url))) erros.foto_url = "Use uma URL http:// ou https:// com até 255 caracteres.";
  if (!parcial) for (const campo of ["sexo", "idade_meses", "foto_url", "historia", "comportamento", "observacoes_extras"]) if (!Object.hasOwn(dados, campo)) dados[campo] = null;
  return { dados, erros };
}

export function validarMotivo(body) {
  const motivo = texto(body?.motivo);
  return typeof motivo === "string" && motivo.length >= 1 && motivo.length <= 255
    ? { dados: { motivo }, erros: {} }
    : { dados: {}, erros: { motivo: "Informe o motivo com até 255 caracteres." } };
}

export const UNIDADES_FEDERATIVAS = Object.freeze([...UFS]);
