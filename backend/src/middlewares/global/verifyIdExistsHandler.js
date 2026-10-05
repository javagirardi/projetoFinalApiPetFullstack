// src/middlewares/carregarEntidade.js
import { NOT_FOUND_STATUS } from "../../constants/server.js";
import { AppDataSource } from "../../config/database_postgres.js";

export const verifyIdExistsHandler =
  (entity, nomeAmigavel) => async (request, response, next) => {
    const id = Number(request.params.id);

    // ids como "abc" ou "1.5" nem chegam ao banco
    if (!Number.isInteger(id) || id <= 0) {
      return response
        .status(NOT_FOUND_STATUS)
        .send({ error: `${nomeAmigavel} não encontrado(a)` });
    }

    const registro = await AppDataSource.getRepository(entity).findOneBy({
      id,
    });

    if (!registro) {
      return response
        .status(NOT_FOUND_STATUS)
        .send({ error: `${nomeAmigavel} não encontrado(a)` });
    }

    request.registro = registro;

    next();
  };
