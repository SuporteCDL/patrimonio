import { FastifyInstance } from "fastify";
import { createGrupo, deleteGrupo, getGrupos, updateGrupo } from "./grupos.controller";

export async function gruposRoutes(app: FastifyInstance) {
  app.get('/', getGrupos)

  app.post('/', createGrupo)
  
  app.put('/:id', updateGrupo)
  
  app.delete('/:id', deleteGrupo)
}