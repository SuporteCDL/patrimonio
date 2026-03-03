import { FastifyInstance } from "fastify";
import { createCentroCusto, deleteCentroCusto, getCentroCusto, updateCentroCusto } from "./centrocusto.controller";

export async function centroCustoRoutes(app: FastifyInstance) {
  app.get('/', getCentroCusto)
  
  app.post('/', createCentroCusto)
  
  app.put('/:id', updateCentroCusto)
  
  app.delete('/:id', deleteCentroCusto)
}