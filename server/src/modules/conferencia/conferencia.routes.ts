import { FastifyInstance } from "fastify";
import { createConferencia, deleteConferencia, getConferencia, getConferencias, updateConferencia } from "./conferencia.controller";

export async function conferenciaRoutes(app: FastifyInstance) {
  app.get('/:id', getConferencia)

  app.get('/', getConferencias)

  app.post('/', createConferencia)
  
  app.put('/', updateConferencia)
  
  app.delete('/:id', deleteConferencia)
}