import { FastifyReply, FastifyRequest } from "fastify";
import { esquemaCriacaoConferencia, esquemaConferencia } from "./conferencia.schema";
import { conferenciaService } from "./conferencia.service";

interface UpdateParam {
  id: number
}

export async function getConferencia(request: FastifyRequest<{ Params: UpdateParam}>, reply: FastifyReply) {
  const { id } = request.params
  if (!id) {
    return reply.status(400).send({
      error: 'Get: Parâmetro não encontrado',
    })
  }
  const conferencia = await conferenciaService.buscar(id)
  return reply.send(conferencia)
}

export async function getConferencias(request: FastifyRequest, reply: FastifyReply) {
  const conferencias = await conferenciaService.listar()
  return reply.send(conferencias)
}

export async function createConferencia(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaCriacaoConferencia.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Create: Erro de validação',
      details: parsed.error.format,
    })
  }
  const novaConferencia = await conferenciaService.criar(parsed.data)
  return reply.code(201).send(novaConferencia)
}

export async function updateConferencia(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaConferencia.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Update: Erro de validação',
      details: parsed.error.format,
    })
  }
  const conferenciaAtualizada = await conferenciaService.alterar(parsed.data)
  return reply.code(201).send(conferenciaAtualizada)
}

export async function deleteConferencia(request: FastifyRequest<{ Params: UpdateParam }>, reply: FastifyReply) {
  const { id } = request.params
  if (!id) {
    return reply.status(400).send({
      error: 'Delete: Erro de validação',
    })
  }
  await conferenciaService.excluir(id)
  return reply.code(201).send('Excluído com sucesso')
}