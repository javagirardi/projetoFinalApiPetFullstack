import { In } from "typeorm";

import { AppDataSource } from "../config/database_postgres.js";
import { AdocaoEntity } from "../entidades/Adocao.js";
import {
  SITUACAO_PET,
  STATUS_ADOCAO,
  STATUS_ATIVOS,
} from "../constants/adocoes.js";

// A situação do pet não é guardada no banco: ela sai das adoções dele.
//   ADOTADO      -> tem adoção CONCLUIDA
//   RESERVADO    -> tem adoção APROVADA (aguardando a entrega)
//   EM_PROCESSO  -> tem pedido em ANALISE ou ENTREVISTA
//   DISPONIVEL   -> nenhum dos casos acima
export function calcularSituacao(statusDasAdocoes) {
  if (statusDasAdocoes.includes(STATUS_ADOCAO.CONCLUIDA)) return SITUACAO_PET.ADOTADO;
  if (statusDasAdocoes.includes(STATUS_ADOCAO.APROVADA)) return SITUACAO_PET.RESERVADO;
  if (statusDasAdocoes.some((s) => STATUS_ATIVOS.includes(s))) return SITUACAO_PET.EM_PROCESSO;
  return SITUACAO_PET.DISPONIVEL;
}

// Busca as adoções que importam para a situação e devolve um Map pet_id -> situação.
// Sem petIds, considera todos os pets.
export async function buscarSituacoes(petIds, manager = AppDataSource.manager) {
  const where = { status: In([...STATUS_ATIVOS, STATUS_ADOCAO.CONCLUIDA]) };
  if (petIds) where.pet_id = In(petIds);

  const adocoes = await manager.getRepository(AdocaoEntity).find({
    where,
    select: { pet_id: true, status: true },
  });

  const statusPorPet = new Map();
  for (const { pet_id, status } of adocoes) {
    statusPorPet.set(pet_id, [...(statusPorPet.get(pet_id) || []), status]);
  }

  const situacoes = new Map();
  for (const [petId, status] of statusPorPet) {
    situacoes.set(petId, calcularSituacao(status));
  }
  return situacoes;
}

export async function buscarSituacao(petId, manager) {
  const situacoes = await buscarSituacoes([petId], manager);
  return situacoes.get(petId) || SITUACAO_PET.DISPONIVEL;
}
