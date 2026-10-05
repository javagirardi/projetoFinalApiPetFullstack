import {
  EXPERIENCIAS,
  STATUS_ADOCAO_VALIDOS,
  STATUS_EXIGEM_MOTIVO,
  TEMPOS_SOZINHO,
} from "../../constants/adocoes.js";
import {
  foiEnviado,
  paraInteiro,
  responderErros,
  textoPreenchido,
} from "../../utils/validacao.js";

// POST /adocoes: pedido feito pelo lar adotivo logado (o lar vem do token, não do body).
// Os dados limpos ficam em request.dadosAdocao.
export function validarAdocao(request, response, next) {
  const dados = request.body ?? {};
  const erros = {};
  const limpos = {};

  const petId = paraInteiro(dados.pet_id);
  if (!(petId > 0)) erros.pet_id = "pet_id é obrigatório e deve ser um id";
  else limpos.pet_id = petId;

  if (!textoPreenchido(dados.motivo) || dados.motivo.trim().length < 10) {
    erros.motivo = "conte em pelo menos 10 caracteres por que quer adotar";
  } else {
    limpos.motivo = dados.motivo.trim();
  }

  if (!EXPERIENCIAS.includes(dados.experiencia)) erros.experiencia = `experiencia deve ser ${EXPERIENCIAS.join(", ")}`;
  else limpos.experiencia = dados.experiencia;

  if (!TEMPOS_SOZINHO.includes(dados.tempo_sozinho)) erros.tempo_sozinho = `tempo_sozinho deve ser ${TEMPOS_SOZINHO.join(", ")}`;
  else limpos.tempo_sozinho = dados.tempo_sozinho;

  if (Object.keys(erros).length > 0) return responderErros(response, erros);

  request.dadosAdocao = limpos;
  next();
}

// PATCH /adocoes/:id/status
export function validarMudancaStatus(request, response, next) {
  const dados = request.body ?? {};
  const erros = {};

  if (!STATUS_ADOCAO_VALIDOS.includes(dados.status)) {
    erros.status = `status deve ser ${STATUS_ADOCAO_VALIDOS.join(", ")}`;
  }
  if (foiEnviado(dados, "observacao") && dados.observacao !== null && typeof dados.observacao !== "string") {
    erros.observacao = "observacao deve ser um texto";
  } else if (STATUS_EXIGEM_MOTIVO.includes(dados.status) && !textoPreenchido(dados.observacao)) {
    // ex.: "Cancelado a pedido do adotante pelo WhatsApp"
    erros.observacao = "informe o motivo na observação";
  }

  if (Object.keys(erros).length > 0) return responderErros(response, erros);

  request.mudancaStatus = { status: dados.status, observacao: dados.observacao?.trim() || null };
  next();
}
