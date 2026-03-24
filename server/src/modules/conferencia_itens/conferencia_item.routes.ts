import { FastifyInstance } from "fastify";
import { createConferenciaItem, 
  deleteConferenciaItem, 
  getConferenciaItems, 
  updateConferenciaItem } from "./conferencia_item.controller";

export async function conferenciaItemRoutes(app: FastifyInstance) {
  app.get('/', getConferenciaItems)

  app.post('/', createConferenciaItem)
  
  app.put('/', updateConferenciaItem)
  
  app.delete('/:id', deleteConferenciaItem)
}