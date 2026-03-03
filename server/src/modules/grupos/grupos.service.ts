import { db } from "../../database/knex";

interface IGrupo {
  id: number
  descricao: string
}

async function listar() {
  return await db('grupos').select('*')
}

async function criar(dados: Omit<IGrupo, 'id'>) {
  const [grupo] = await db('grupos').insert({
    descricao: dados.descricao,
  })
  .returning('*')
  return grupo
}

async function alterar(dados: IGrupo) {
  const [grupo] = await db('grupos')
  .where({ id: Number(dados.id)})
  .update({
    descricao: dados.descricao,
  })
  .returning('*')
  return grupo
}

async function excluir(id: Number) {
  await db('grupos')
  .where({ id: id})
  .delete()
  return 
}

export const grupoService = { listar, criar, alterar, excluir }