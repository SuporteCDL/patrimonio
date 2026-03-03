import { db } from "../../database/knex";

interface ICentroCusto {
  id: number
  descricao: string
}

async function listar() {
  return await db('centro_custo').select('*').orderBy('descricao')
}

async function criar(dados: Omit<ICentroCusto, 'id'>) {
  const [centroCusto] = await db('centro_custo').insert({
    descricao: dados.descricao,
  })
  .returning('*')
  return centroCusto
}

async function alterar(dados: ICentroCusto) {
  const [centroCusto] = await db('centro_custo')
  .where({ id: Number(dados.id)})
  .update({
    descricao: dados.descricao,
  })
  .returning('*')
  return centroCusto
}

async function excluir(id: Number) {
  await db('centro_custo')
  .where({ id: id})
  .delete()
  return 
}

export const centroCustoService = { listar, criar, alterar, excluir }