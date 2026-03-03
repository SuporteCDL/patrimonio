import { db } from "../../database/knex";

interface IMarca {
  id: number
  descricao: string
}

async function listar() {
  return await db('marcas').select('*')
}

async function criar(dados: Omit<IMarca, 'id'>) {
  const [marca] = await db('marcas').insert({
    descricao: dados.descricao,
  })
  .returning('*')
  return marca
}

async function alterar(dados: IMarca) {
  const [marca] = await db('marcas')
  .where({ id: Number(dados.id)})
  .update({
    descricao: dados.descricao,
  })
  .returning('*')
  return marca
}

async function excluir(id: Number) {
  await db('marcas')
  .where({ id: id})
  .delete()
  return 
}

export const marcaService = { listar, criar, alterar, excluir }