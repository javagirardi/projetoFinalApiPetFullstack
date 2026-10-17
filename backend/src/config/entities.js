import { TipoSchema } from "../entities/Tipo.schema.js";
import { RacaSchema } from "../entities/Raca.schema.js";
import { CorSchema } from "../entities/Cor.schema.js";
import { UsuarioSchema } from "../entities/Usuario.schema.js";
import { LarAdotivoSchema } from "../entities/LarAdotivo.schema.js";
import { PetSchema } from "../entities/Pet.schema.js";
import { AdocaoSchema } from "../entities/Adocao.schema.js";
import { AdocaoHistoricoSchema } from "../entities/AdocaoHistorico.schema.js";

export const entities = [TipoSchema, RacaSchema, CorSchema, UsuarioSchema, LarAdotivoSchema, PetSchema, AdocaoSchema, AdocaoHistoricoSchema];
