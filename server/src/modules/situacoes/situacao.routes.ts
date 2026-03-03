import { FastifyInstance } from "fastify";
import { createSituacao, deleteSituacao, getSituacao, updateSituacao } from "./situacao.controller";

export async function situacaoRoutes(app: FastifyInstance) {
  app.get('/', getSituacao)
  app.post('/', createSituacao)
  app.put('/', updateSituacao)
  app.delete('/', deleteSituacao)
}