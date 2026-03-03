import { db } from "../../database/knex"
import { EsquemaAlteracaoSituacao, EsquemaCriacaoSituacao } from "./situacao.schema"

async function listar() {
  return await db('situacoes').select('*').orderBy('situacao')
}

async function criar(dados: Omit<EsquemaCriacaoSituacao, 'id'>) {
  const [situacao] = await db('situacoes').insert({
    situacao: dados.situacao,
  })
  .returning('*')
  return situacao
}

async function alterar(dados: EsquemaAlteracaoSituacao) {
  const [situacao] = await db('situacoes')
  .where({ id: Number(dados.id)})
  .update({
    situacao: dados.situacao
  })
  .returning('*')
  return situacao
}

async function excluir(id: number) {
  await db('situacoes')
  .where({ id: id })
  .delete()
  return
}

export const situacaoService = { listar, criar, alterar, excluir }