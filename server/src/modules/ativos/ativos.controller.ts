import { FastifyReply, FastifyRequest } from "fastify";
import { esquemaCriacaoAtivo, ativosQuerySchema, esquemaAlteracaoAtivo, ativosConferenciaQuerySchema, ativosGeralQuerySchema } from "./ativos.schema";
import { ativoService } from "./ativos.service";

interface UpdateAtivoParam {
  id: number
}

interface CodigoAtivoParam {
  codigo: string
}

interface CodLocalidadeParam {
  codlocalidade: number
}

export async function getAtivos(request: FastifyRequest, reply: FastifyReply) {
  const parseResult = ativosQuerySchema.safeParse(request.query)
  if (!parseResult.success) {
    return reply.status(400).send({ error: parseResult.error })
  }
  const { codlocalidade, codcentrocusto, codsubgrupo, codmarca, codigo } = parseResult.data
  const ativos = await ativoService.listar(
    codlocalidade,
    codcentrocusto,
    codsubgrupo,
    codmarca,
    codigo
  )
  return reply.send(ativos)
}

export async function getAtivo(request: FastifyRequest<{ Params: CodigoAtivoParam }>, reply: FastifyReply) {
  const { codigo } = request.params
  if (!codigo) {
    return reply.status(400).send({
      error: 'Código não informado',
    })
  }
  const buscaAtivo = await ativoService.buscarAtivo(codigo)
  return reply.send(buscaAtivo)
}

export async function getAtivosGeral(request: FastifyRequest, reply: FastifyReply) {
  const parseResult = ativosGeralQuerySchema.safeParse(request.query)
  if (!parseResult.success) {
    return reply.status(400).send({ error: parseResult.error })
  }
  const { encontrado, status, ordem } = parseResult.data
  const ativos = await ativoService.listaAtivosGeral(
    encontrado,
    status,
    ordem
  )
  return reply.send(ativos)
}

export async function getAtivosConferencia(request: FastifyRequest, reply: FastifyReply) {
  const parseResult = ativosConferenciaQuerySchema.safeParse(request.query)
  if (!parseResult.success) {
    return reply.status(400).send({ error: parseResult.error })
  }
  const { codlocalidade, encontrado, ordem } = parseResult.data
  const ativos = await ativoService.listaAtivosConferencia(
    encontrado,
    codlocalidade,
    ordem
  )
  return reply.send(ativos)
}

export async function getTotalAtivos(request: FastifyRequest<{ Params: CodLocalidadeParam }>, reply: FastifyReply) {
  const { codlocalidade } = request.params
  const totalAtivos = await ativoService.totalAtivos(codlocalidade)
  return reply.send(totalAtivos)
}

export async function getAtivosPorCentroCustoQtd(request: FastifyRequest<{ Params: CodLocalidadeParam }>, reply: FastifyReply) {
  const { codlocalidade } = request.params
  const ativosQtd = await ativoService.ativosPorCentroCustoQtd(codlocalidade)
  return reply.send(ativosQtd)
}

export async function getAtivosPorGrupo(request: FastifyRequest<{ Params: CodLocalidadeParam }>, reply: FastifyReply) {
  const { codlocalidade } = request.params
  const ativosPorGrupo = await ativoService.ativosPorGrupo(codlocalidade)
  return reply.send(ativosPorGrupo)
}

export async function getAtivosPorSubGrupo(request: FastifyRequest<{ Params: CodLocalidadeParam }>, reply: FastifyReply) {
  const { codlocalidade } = request.params
  const ativosPorSubGrupo = await ativoService.ativosPorSubGrupo(codlocalidade)
  return reply.send(ativosPorSubGrupo)
}

export async function getAtivosConferidosBaixados(request: FastifyRequest<{ Params: CodLocalidadeParam }>, reply: FastifyReply) {
  const { codlocalidade } = request.params
  const ativosConferidosBaixados = await ativoService.ativosConferidosBaixados(codlocalidade)
  return reply.send(ativosConferidosBaixados)
}

export async function getAtivosValoresTotais(request: FastifyRequest<{ Params: CodLocalidadeParam }>, reply: FastifyReply) {
  const { codlocalidade } = request.params
  const ativosValoresTotais = await ativoService.ativosValoresTotais(codlocalidade)
  return reply.send(ativosValoresTotais)
}

export async function getQuantidadeAtivosPorAnoAquisicao(request: FastifyRequest<{ Params: CodLocalidadeParam }>, reply: FastifyReply) {
  const { codlocalidade } = request.params
  const quantidadePorAnoAquisicao = await ativoService.quantidadeAtivosPorAnoAquisicao(codlocalidade)
  return reply.send(quantidadePorAnoAquisicao)
}

export async function createAtivo(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaCriacaoAtivo.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const novoAtivo = await ativoService.criar(parsed.data)
  return reply.code(201).send(novoAtivo)
}

export async function updateAtivo(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaAlteracaoAtivo.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const ativoAtualizado = await ativoService.alterar(parsed.data)
  return reply.code(201).send(ativoAtualizado)
}

export async function deleteAtivo(request: FastifyRequest<{ Params: UpdateAtivoParam }>, reply: FastifyReply) {
  const { id } = request.params
  if (!id) {
    return reply.status(400).send({
      error: 'Erro de validação',
    })
  }
  await ativoService.excluir(id)
  return reply.code(201).send('Excluído com sucesso')
}