import { db } from "../../database/knex";

export interface IConferenciaItem {
  id: number
  conferencia_id: number
  patrimonio_id: number
  encontrado: boolean
  observacao?: string | undefined
  data_verificacao?: Date | undefined
}

async function listar() {
  return await db('conferencia_itens')
  .join('conferencia', 'conferencia_itens.conferencia_id', '=', 'conferencia.id')
  .join('ativos', 'conferencia_itens.patrimonio_id', '=', 'ativos.id')
  .select(
    'conferencia.descricao as conferencia',
    'conferencia.data_inicio',
    'conferencia.data_fim',
    'conferencia.responsavel',
    'conferencia.status',
    'ativos.codigo',
    'ativos.descricao as ativo',
    'conferencia_itens.encontrado',
    'conferencia_itens.observacao',
  )
}

async function criar(dados: Omit<IConferenciaItem, 'id'>) {
  const [conferencia] = await db('conferencia_itens').insert({
    conferencia_id: dados.conferencia_id,
    patrimonio_id: dados.patrimonio_id,
    encontrado: dados.encontrado,
    data_verificacao: dados.data_verificacao,
    observacao: dados.observacao,
  })
  .returning('*')
  return conferencia
}

async function alterar(dados: IConferenciaItem) {
  const [conferenciaItem] = await db('conferencia_itens')
  .where({ id: Number(dados.id)})
  .update({
    conferencia_id: dados.conferencia_id,
    patrimonio_id: dados.patrimonio_id,
    encontrado: dados.encontrado,
    data_verificacao: dados.data_verificacao,
    observacao: dados.observacao,
  })
  .returning('*')
  return conferenciaItem
}

async function excluir(id: Number) {
  await db('conferencia_itens')
  .where({ id: id})
  .delete()
  return 
}

export const conferenciaItemService = { listar, criar, alterar, excluir }