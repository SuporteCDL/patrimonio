import { FastifyReply, FastifyRequest } from "fastify";
import { esquemaConferenciaItem, esquemaUpdateConferenciaItem } from "./conferencia_item.schema";
import { conferenciaItemService, IConferenciaItem } from "./conferencia_item.service";

interface UpdateParam {
  id: number
}

export async function getConferenciaItems(request: FastifyRequest, reply: FastifyReply) {
  const conferenciaItens = await conferenciaItemService.listar()
  return reply.send(conferenciaItens)
}

export async function createConferenciaItem(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaConferenciaItem.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format,
    })
  }
  const novaConferenciaItem = await conferenciaItemService.criar(parsed.data)
  return reply.code(201).send(novaConferenciaItem)
}

export async function updateConferenciaItem(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaUpdateConferenciaItem.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format,
    })
  }
  const conferenciaItemAtualizada = await conferenciaItemService.alterar(parsed.data)
  return reply.code(201).send(conferenciaItemAtualizada)
}

export async function deleteConferenciaItem(request: FastifyRequest<{ Params: UpdateParam }>, reply: FastifyReply) {
  const { id } = request.params
  if (!id) {
    return reply.status(400).send({
      error: 'Erro de validação',
    })
  }
  await conferenciaItemService.excluir(id)
  return reply.code(201).send('Excluído com sucesso')
}