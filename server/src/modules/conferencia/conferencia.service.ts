import { db } from "../../database/knex";

interface IConferencia {
  id: number
  descricao: string
  data_inicio: string
  data_fim: string
  responsavel: string
  status: string
}

async function buscar(id: number) {
  return await db('conferencia')
  .select('*')
  .where('id', id)
  .first()
}

async function listar() {
  return await db('conferencia').select('*')
}

async function criar(dados: Omit<IConferencia, 'id'>) {
  const conferencia = await db('conferencia').insert({
    descricao: dados.descricao,
    data_inicio: dados.data_inicio,
    data_fim: dados.data_fim,
    responsavel: dados.responsavel,
    status: dados.status
  })
  .returning('*')
  return conferencia[0]
}

async function alterar(dados: IConferencia) {
  const [conferencia] = await db('conferencia')
  .where({ id: Number(dados.id)})
  .update({
    descricao: dados.descricao,
    data_inicio: dados.data_inicio,
    data_fim: dados.data_fim,
    responsavel: dados.responsavel,
    status: dados.status
  })
  .returning('*')
  return conferencia
}

async function excluir(id: Number) {
  await db('conferencia')
  .where({ id: id})
  .delete()
  return 
}

export const conferenciaService = { buscar, listar, criar, alterar, excluir }