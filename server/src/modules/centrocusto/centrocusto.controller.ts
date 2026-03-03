import { FastifyReply, FastifyRequest } from "fastify";
import { esquemaCriacaoCentroCusto, esquemaAlteracaoCentroCusto } from "./centrocusto.schema";
import { centroCustoService } from "./centrocusto.service";

interface UpdateCentroCustoParam {
  id: number
}

export async function getCentroCusto(request: FastifyRequest, reply: FastifyReply) {
  const centroCusto = await centroCustoService.listar()
  return reply.send(centroCusto)
}

export async function createCentroCusto(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaCriacaoCentroCusto.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const novoCentroCusto = await centroCustoService.criar(parsed.data)
  return reply.code(201).send(novoCentroCusto)
}

export async function updateCentroCusto(request: FastifyRequest<{ Params: UpdateCentroCustoParam }>, reply: FastifyReply) {
  const { id } = request.params
  const parsed = esquemaCriacaoCentroCusto.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const centroCustoAtualizado = await centroCustoService.alterar({
    id: Number(id),
    ...parsed.data
  })
  return reply.code(201).send(centroCustoAtualizado)
}

export async function deleteCentroCusto(request: FastifyRequest<{ Params: UpdateCentroCustoParam }>, reply: FastifyReply) {
  const { id } = request.params
  if (!id) {
    return reply.status(400).send({
      error: 'Erro de validação',
    })
  }
  await centroCustoService.excluir(id)
  return reply.code(201).send('Excluído com sucesso')
}