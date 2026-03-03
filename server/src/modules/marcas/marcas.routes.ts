import { FastifyInstance } from "fastify";
import { createMarca, deleteMarca, getMarcas, updateMarca } from "./marcas.controller";

export async function marcasRoutes(app: FastifyInstance) {
  app.get('/', getMarcas)

  app.post('/', createMarca)

  app.put('/:id', updateMarca)
  
  app.delete('/:id', deleteMarca)
}