import { FastifyReply, FastifyRequest } from "fastify";
import { esquemaCriacaoGrupo, esquemaAlteracaoGrupo } from "./grupos.schema";
import { grupoService } from "./grupos.service";

interface UpdateGrupoParam {
  id: number
}

export async function getGrupos(request: FastifyRequest, reply: FastifyReply) {
  const grupos = await grupoService.listar()
  return reply.send(grupos)
}

export async function createGrupo(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaCriacaoGrupo.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const novoGrupo = await grupoService.criar(parsed.data)
  return reply.code(201).send(novoGrupo)
}

export async function updateGrupo(request: FastifyRequest<{ Params: UpdateGrupoParam }>, reply: FastifyReply) {
  const { id } = request.params
  const parsed = esquemaCriacaoGrupo.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const grupoAtualizado = await grupoService.alterar({
    id: Number(id),
    ...parsed.data
  })
  return reply.code(201).send(grupoAtualizado)
}

export async function deleteGrupo(request: FastifyRequest<{ Params: UpdateGrupoParam }>, reply: FastifyReply) {
  const { id } = request.params
  if (!id) {
    return reply.status(400).send({
      error: 'Erro de validação',
    })
  }
  await grupoService.excluir(id)
  return reply.code(201).send('Excluído com sucesso')
}