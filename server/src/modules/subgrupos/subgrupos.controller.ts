import { FastifyReply, FastifyRequest } from "fastify";
import { esquemaCriacaoSubGrupo, esquemaAlteracaoSubGrupo } from "./subgrupos.schema";
import { subGrupoService } from "./subgrupos.service";

interface UpdateSubGrupoParam {
  id: number
}

export async function getSubGrupos(request: FastifyRequest, reply: FastifyReply) {
  const subGrupos = await subGrupoService.listar()
  return reply.send(subGrupos)
}

export async function getSubGruposPorGrupo(request: FastifyRequest, reply: FastifyReply) {
  const subGrupos = await subGrupoService.listarPorGrupo()
  return reply.send(subGrupos)
}

export async function createSubGrupo(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaCriacaoSubGrupo.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const novoSubGrupo = await subGrupoService.criar(parsed.data)
  return reply.code(201).send(novoSubGrupo)
}

export async function updateSubGrupo(request: FastifyRequest<{ Params: UpdateSubGrupoParam }>, reply: FastifyReply) {
  const { id } = request.params
  const parsed = esquemaCriacaoSubGrupo.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const subGrupoAtualizado = await subGrupoService.alterar({
    id: Number(id),
    ...parsed.data
  })
  return reply.code(201).send(subGrupoAtualizado)
}

export async function deleteSubGrupo(request: FastifyRequest<{ Params: UpdateSubGrupoParam }>, reply: FastifyReply) {
  const { id } = request.params
  if (!id) {
    return reply.status(400).send({
      error: 'Erro de validação',
    })
  }
  await subGrupoService.excluir(id)
  return reply.code(201).send('Excluído com sucesso')
}