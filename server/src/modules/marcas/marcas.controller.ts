import { FastifyReply, FastifyRequest } from "fastify";
import { esquemaCriacaoMarca, esquemaAlteracaoMarca } from "./marcas.shcema";
import { marcaService } from "./marcas.service";

interface UpdateMarcaParams {
  id: number
}

export async function getMarcas(request: FastifyRequest, reply: FastifyReply) {
  const marcas = await marcaService.listar()
  return reply.send(marcas)
}

export async function createMarca(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaCriacaoMarca.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const novoMarca = await marcaService.criar(parsed.data)
  return reply.code(201).send(novoMarca)
}

export async function updateMarca(request: FastifyRequest<{ Params: UpdateMarcaParams }>, reply: FastifyReply) {
  const { id } = request.params
  const parsed = esquemaCriacaoMarca.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const marcaAtualizado = await marcaService.alterar({
    id: Number(id),
    ...parsed.data
  })
  return reply.code(201).send(marcaAtualizado)
}

export async function deleteMarca(request: FastifyRequest<{ Params: UpdateMarcaParams }>, reply: FastifyReply) {
  const { id } = request.params
  if (!id) {
    return reply.status(400).send({
      error: 'Erro de validação',
    })
  }
  await marcaService.excluir(id)
  return reply.code(201).send('Excluído com sucesso')
}