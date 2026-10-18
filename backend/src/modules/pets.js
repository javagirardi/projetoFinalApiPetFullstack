import { Router } from "express";
import { ROLE, calcularSituacaoPet, contarPedidosEmAndamento, validarPet, validarMotivo } from "@lab365/contracts";
import { autenticar, exigirRole } from "../auth/middleware.js";
import { HttpError } from "../http/errors.js";

export function petPublico(pet) {
  const { adocoes = [], ...dados } = pet;
  const concluida = adocoes.find(({ status }) => status === "CONCLUIDA");
  return { ...dados, situacao: calcularSituacaoPet(pet), pedidos_em_andamento: contarPedidosEmAndamento(adocoes),
    adotado_por: concluida?.lar ? { id: concluida.lar.id, nome: concluida.lar.nome } : null };
}
const relations = { tipo: true, raca: true, cor: true, adocoes: { lar: true } };

async function carregarPet(manager, id, bloquear = false) {
  if (bloquear) {
    const existente = await manager.getRepository("Pet").findOne({ where: { id }, lock: { mode: "pessimistic_write" } });
    if (!existente) throw new HttpError(404, "Pet não encontrado.");
  }
  const pet = await manager.getRepository("Pet").findOne({ where: { id }, relations });
  if (!pet) throw new HttpError(404, "Pet não encontrado.");
  return pet;
}

function exigirPetArquivavel(pet) {
  if (pet.arquivado_em) throw new HttpError(409, "Este pet já está arquivado.");
  if (contarPedidosEmAndamento(pet.adocoes)) throw new HttpError(409, "O pet possui pedido em andamento e não pode ser arquivado.");
  if (pet.adocoes.some(({ status }) => status === "CONCLUIDA")) throw new HttpError(409, "Um pet adotado não pode ser arquivado.");
}

export function criarRotasPets({ dataSource, seguranca }) {
  const router = Router();
  const equipe = [autenticar(seguranca), exigirRole(ROLE.EQUIPE)];
  for (const [rota, entidade] of [["tipos", "Tipo"], ["racas", "Raca"], ["cores", "Cor"]]) {
    router.get(`/${rota}`, async (req, res) => res.json(await dataSource.getRepository(entidade).find({ order: { nome: "ASC" } })));
  }
  function idPet(req) {
    const id = Number(req.params.id);
    if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) throw new HttpError(400, "ID de pet inválido.");
    return id;
  }
  const carregar = carregarPet;
  async function conferirDados(body, parcial = false) {
    const { dados, erros } = validarPet(body, parcial);
    for (const [campo, entidade] of [["tipo_id", "Tipo"], ["raca_id", "Raca"], ["cor_id", "Cor"]]) {
      if (Object.hasOwn(dados, campo) && !erros[campo]) {
        if (!(await dataSource.getRepository(entidade).existsBy({ id: dados[campo] }))) erros[campo] = "A opção selecionada não existe.";
      }
    }
    if (Object.keys(erros).length) throw new HttpError(400, "Confira os campos informados.", erros);
    const resultado = { ...dados };
    for (const [campo, relacao] of [["tipo_id", "tipo"], ["raca_id", "raca"], ["cor_id", "cor"]]) {
      if (Object.hasOwn(dados, campo)) resultado[relacao] = { id: dados[campo] };
    }
    return resultado;
  }
  router.get("/pets", ...equipe, async (req, res) => {
    const pets = await dataSource.getRepository("Pet").find({ relations, order: { id: "DESC" } });
    return res.json(pets.map(petPublico));
  });
  return router;
}
