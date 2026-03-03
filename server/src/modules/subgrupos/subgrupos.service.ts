import { db } from "../../database/knex";

interface ISubGrupo {
  id: number
  codgrupo: number
  descricao: string
}

async function listar() {
  return await db('subgrupos')
  .select('*')
  .orderBy('descricao')
}

async function listarPorGrupo() {
  return await db('subgrupos')
  .join('grupos', 'subgrupos.codgrupo', '=', 'grupos.id')
  .select('grupos.descricao as grupo', 'subgrupos.id', 'subgrupos.descricao')
  .orderBy('grupos.descricao','asc')
  .orderBy('subgrupos.descricao','asc')
}

async function criar(dados: Omit<ISubGrupo, 'id'>) {
  const [subGrupo] = await db('subgrupos').insert({
    codgrupo: Number(dados.codgrupo),
    descricao: dados.descricao,
  })
  .returning('*')
  return subGrupo
}

async function alterar(dados: ISubGrupo) {
  const [subGrupo] = await db('subgrupos')
  .where({ id: Number(dados.id)})
  .update({
    codgrupo: Number(dados.codgrupo),
    descricao: dados.descricao,
  })
  .returning('*')
  return subGrupo
}

async function excluir(id: Number) {
  await db('subgrupos')
  .where({ id: id})
  .delete()
  return 
}

export const subGrupoService = { listar, listarPorGrupo, criar, alterar, excluir }