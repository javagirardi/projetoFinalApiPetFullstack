import { MORADIAS } from "../../constants/lares.js";
import {
  UFS,
  foiEnviado,
  paraInteiro,
  responderErros,
  textoPreenchido,
} from "../../utils/validacao.js";

const REGEX_EMAIL = /^\S+@\S+\.\S+$/;
const REGEX_TELEFONE = /^\(\d{2}\) \d{5}-\d{4}$/;
const REGEX_CEP = /^\d{5}-\d{3}$/;

// "maximo" segue o tamanho das colunas em database.sql
const CAMPOS_ENDERECO = [
  { campo: "rua", mensagem: "rua é obrigatória", maximo: 150 },
  { campo: "numero", mensagem: "numero é obrigatório (use S/N se não houver)", maximo: 20 },
  { campo: "bairro", mensagem: "bairro é obrigatório", maximo: 100 },
  { campo: "cidade", mensagem: "cidade é obrigatória", maximo: 100 },
];
const CAMPOS_LAR = ["nome", "email", "senha", "telefone", "cep", "estado", "moradia", "moradores", "outros_animais", ...CAMPOS_ENDERECO.map((c) => c.campo)];

// Mesmas regras do formulário de cadastro do front-end.
// POST: todos os campos são obrigatórios. PUT (parcial = true): valida só os enviados.
// Os dados limpos ficam em request.dadosLar (a senha ainda sem hash).
export const validarLar =
  (parcial = false) =>
  (request, response, next) => {
    const dados = request.body ?? {};
    const erros = {};
    const limpos = {};
    const deveValidar = (campo) => !parcial || foiEnviado(dados, campo);

    if (parcial && !CAMPOS_LAR.some((campo) => foiEnviado(dados, campo))) {
      return responderErros(response, { body: "Envie ao menos um campo para atualizar" });
    }

    if (deveValidar("nome")) {
      if (!textoPreenchido(dados.nome) || dados.nome.trim().length < 3) erros.nome = "nome deve ter ao menos 3 caracteres";
      else if (dados.nome.trim().length > 100) erros.nome = "nome deve ter no máximo 100 caracteres";
      else limpos.nome = dados.nome.trim();
    }

    if (deveValidar("email")) {
      const email = typeof dados.email === "string" ? dados.email.trim().toLowerCase() : "";
      if (!REGEX_EMAIL.test(email)) erros.email = "informe um e-mail válido";
      else if (email.length > 150) erros.email = "e-mail deve ter no máximo 150 caracteres";
      else limpos.email = email;
    }

    if (deveValidar("senha")) {
      if (typeof dados.senha !== "string" || dados.senha.length < 6) erros.senha = "a senha precisa ter ao menos 6 caracteres";
      else limpos.senha = dados.senha;
    }

    if (deveValidar("telefone")) {
      if (!REGEX_TELEFONE.test(dados.telefone)) erros.telefone = "telefone deve estar no formato (85) 99999-9999";
      else limpos.telefone = dados.telefone;
    }

    if (deveValidar("cep")) {
      if (!REGEX_CEP.test(dados.cep)) erros.cep = "cep deve estar no formato 00000-000";
      else limpos.cep = dados.cep;
    }

    for (const { campo, mensagem, maximo } of CAMPOS_ENDERECO) {
      if (!deveValidar(campo)) continue;
      if (!textoPreenchido(dados[campo])) erros[campo] = mensagem;
      else if (dados[campo].trim().length > maximo) erros[campo] = `${campo} deve ter no máximo ${maximo} caracteres`;
      else limpos[campo] = dados[campo].trim();
    }

    if (deveValidar("estado")) {
      if (!UFS.includes(dados.estado)) erros.estado = "estado deve ser uma UF válida (ex.: CE)";
      else limpos.estado = dados.estado;
    }

    if (deveValidar("moradia")) {
      if (!MORADIAS.includes(dados.moradia)) erros.moradia = `moradia deve ser ${MORADIAS.join(", ")}`;
      else limpos.moradia = dados.moradia;
    }

    if (deveValidar("moradores")) {
      const moradores = paraInteiro(dados.moradores);
      if (!(moradores >= 1)) erros.moradores = "moradores deve ser um número inteiro maior ou igual a 1";
      else limpos.moradores = moradores;
    }

    if (deveValidar("outros_animais")) {
      if (typeof dados.outros_animais !== "boolean") erros.outros_animais = "outros_animais deve ser true ou false";
      else limpos.outros_animais = dados.outros_animais;
    }

    if (Object.keys(erros).length > 0) return responderErros(response, erros);

    request.dadosLar = limpos;
    next();
  };
