import { FastifyReply, FastifyRequest } from "fastify";
import { situacaoService } from "./situacao.service";
import { EsquemaAlteracaoSituacao, esquemaAlteracaoSituacao, esquemaCriacaoSituacao } from "./situacao.schema";

interface UpdateSituacaoParam {
  id: number
}

export async function getSituacao(request: FastifyRequest, reply: FastifyReply) {
  const situacao = await situacaoService.listar()
  return reply.send(situacao)
}

export async function createSituacao(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaCriacaoSituacao.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format()
    })
  }
  const novaSituacao = await situacaoService.criar(parsed.data)
  return reply.code(201).send(novaSituacao)
}

export async function updateSituacao(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaAlteracaoSituacao.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format()
    })
  }
  const situacaoAtualizada = await situacaoService.alterar(parsed.data)
  return reply.code(201).send(situacaoAtualizada)
}

export async function deleteSituacao(request: FastifyRequest<{ Params: UpdateSituacaoParam }>, reply: FastifyReply) {
  const { id } = request.params
  if (!id) {
    return reply.status(400).send({
      error: 'Erro de validação',
    })
  }
  await situacaoService.excluir(id)
  return reply.code(201).send('Excluído com sucesso')
}