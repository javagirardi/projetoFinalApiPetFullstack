import { AppDataSource } from "../../config/database_postgres.js";
import { TipoEntity } from "../../entidades/Tipo.js";
import { RacaEntity } from "../../entidades/Raca.js";
import { CorEntity } from "../../entidades/Cor.js";
import { PORTES, SEXOS } from "../../constants/pets.js";
import {
  foiEnviado,
  paraInteiro,
  responderErros,
  textoPreenchido,
} from "../../utils/validacao.js";

const CAMPOS_ID = [
  { campo: "tipo_id", entidade: TipoEntity, nome: "tipo" },
  { campo: "raca_id", entidade: RacaEntity, nome: "raça" },
  { campo: "cor_id", entidade: CorEntity, nome: "cor" },
];
const CAMPOS_TEXTO_OPCIONAIS = ["foto_url", "historia", "comportamento", "observacoes_extras"];
const CAMPOS_PET = ["nome", "porte", "sexo", "idade_meses", ...CAMPOS_ID.map((c) => c.campo), ...CAMPOS_TEXTO_OPCIONAIS];

// POST: todos os obrigatórios precisam vir.
// PUT (parcial = true): valida só os campos enviados.
// Os dados limpos ficam em request.dadosPet.
export const validarPet =
  (parcial = false) =>
  async (request, response, next) => {
    const dados = request.body ?? {};
    const erros = {};
    const limpos = {};
    const deveValidar = (campo) => !parcial || foiEnviado(dados, campo);

    if (parcial && !CAMPOS_PET.some((campo) => foiEnviado(dados, campo))) {
      return responderErros(response, { body: "Envie ao menos um campo para atualizar" });
    }

    if (deveValidar("nome")) {
      if (!textoPreenchido(dados.nome)) erros.nome = "nome é obrigatório";
      else if (dados.nome.trim().length > 100) erros.nome = "nome deve ter no máximo 100 caracteres";
      else limpos.nome = dados.nome.trim();
    }

    for (const { campo, entidade, nome } of CAMPOS_ID) {
      if (!deveValidar(campo)) continue;
      const id = paraInteiro(dados[campo]);
      if (!(id > 0)) {
        erros[campo] = `${campo} é obrigatório e deve ser um id`;
      } else if (!(await AppDataSource.getRepository(entidade).existsBy({ id }))) {
        erros[campo] = `${nome} com id ${id} não existe`;
      } else {
        limpos[campo] = id;
      }
    }

    if (deveValidar("porte")) {
      if (!PORTES.includes(dados.porte)) erros.porte = "porte é obrigatório e deve ser P, M ou G";
      else limpos.porte = dados.porte;
    }

    if (foiEnviado(dados, "sexo")) {
      if (dados.sexo !== null && !SEXOS.includes(dados.sexo)) erros.sexo = "sexo deve ser M ou F";
      else limpos.sexo = dados.sexo;
    }

    for (const campo of CAMPOS_TEXTO_OPCIONAIS) {
      if (!foiEnviado(dados, campo)) continue;
      if (dados[campo] !== null && typeof dados[campo] !== "string") erros[campo] = `${campo} deve ser um texto`;
      else limpos[campo] = dados[campo]?.trim() || null;
    }
    if (limpos.foto_url?.length > 255) erros.foto_url = "foto_url deve ter no máximo 255 caracteres";

    if (foiEnviado(dados, "idade_meses") && dados.idade_meses !== null) {
      const idade = paraInteiro(dados.idade_meses);
      if (!(idade >= 0)) erros.idade_meses = "idade_meses deve ser um número inteiro";
      else limpos.idade_meses = idade;
    } else if (foiEnviado(dados, "idade_meses")) {
      limpos.idade_meses = null;
    }

    if (Object.keys(erros).length > 0) return responderErros(response, erros);

    request.dadosPet = limpos;
    next();
  };

// PATCH /pets/:id/arquivar: o motivo é obrigatório (ex.: "Transferido para outra ONG")
export function validarArquivamento(request, response, next) {
  const { motivo } = request.body ?? {};

  if (typeof motivo !== "string" || !textoPreenchido(motivo)) {
    return responderErros(response, { motivo: "informe o motivo do arquivamento" });
  }
  if (motivo.trim().length > 255) {
    return responderErros(response, { motivo: "motivo deve ter no máximo 255 caracteres" });
  }

  request.motivoArquivamento = motivo.trim();
  next();
}
