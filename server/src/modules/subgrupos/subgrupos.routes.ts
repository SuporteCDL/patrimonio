import { FastifyInstance } from "fastify";
import { createSubGrupo, deleteSubGrupo, getSubGrupos, getSubGruposPorGrupo, updateSubGrupo } from "./subgrupos.controller";

export async function subGruposRoutes(app: FastifyInstance) {
  // app.get('/', getSubGrupos)

  app.get('/', getSubGruposPorGrupo)

  app.post('/', createSubGrupo)
  
  app.put('/:id', updateSubGrupo)
  
  app.delete('/:id', deleteSubGrupo)
}