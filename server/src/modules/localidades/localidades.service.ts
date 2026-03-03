import { db } from "../../database/knex";

interface ILocalidade {
  id: number
  descricao: string
}

async function listar() {
  return await db('localidades').select('*')
}

async function criar(dados: Omit<ILocalidade, 'id'>) {
  const [localidade] = await db('localidades').insert({
    descricao: dados.descricao,
  })
  .returning('*')
  return localidade
}

async function alterar(dados: ILocalidade) {
  const [localidade] = await db('localidades')
  .where({ id: Number(dados.id)})
  .update({
    descricao: dados.descricao,
  })
  .returning('*')
  return localidade
}

async function excluir(id: Number) {
  await db('localidades')
  .where({ id: id})
  .delete()
  return 
}

export const localidadeService = { listar, criar, alterar, excluir }