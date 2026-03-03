import { db } from "../../database/knex";

interface IAtivo {
  id: number
  codlocalidade: number
  codigo: string
  status: string
  motivo_baixa: string
  descricao: string
  aquisicao: string
  valor_aquisicao: number
  valor_atual: number
  depreciacao: number
  codsubgrupo: number
  codcentrocusto: number
  codmarca: number
  encontrado: boolean
  responsavel: string
}

async function listar(
  codlocalidade?: number,
  codcentrocusto?: number,
  codsubgrupo?: number,
  codmarca?: number,
  codigo?: string
) {
  // A consulta base
  const query = db('ativos')
    .join('localidades', 'ativos.codlocalidade', '=', 'localidades.id')
    .join('subgrupos', 'ativos.codsubgrupo', '=', 'subgrupos.id')
    .join('centro_custo', 'ativos.codcentrocusto', '=', 'centro_custo.id')
    .join('marcas', 'ativos.codmarca', '=', 'marcas.id')
    .select(
      'localidades.descricao as localidade',
      'subgrupos.descricao as subgrupo',
      'centro_custo.descricao as centrocusto',
      'marcas.descricao as marca',
      'ativos.*'
    )
    .orderBy('centro_custo.descricao', 'asc')
    .orderBy('subgrupos.descricao', 'asc')
    .orderBy('ativos.descricao', 'asc')

  // Condições opcionais
  if (codlocalidade && codlocalidade > 0) {
    query.where('ativos.codlocalidade', codlocalidade)
  }

  if (codcentrocusto && codcentrocusto > 0) {
    query.andWhere('ativos.codcentrocusto', codcentrocusto)
  }

  if (codsubgrupo && codsubgrupo > 0) {
    query.andWhere('ativos.codsubgrupo', codsubgrupo)
  }

  if (codmarca && codmarca > 0) {
    query.andWhere('ativos.codmarca', codmarca)
  }

  if (codigo && codigo.trim() !== '') {
    query.andWhere('ativos.codigo', 'like', `%${codigo}%`)
  }

  // Executa a query
  return await query
}

async function buscarAtivo(codigo: string) {
  const ativo = await db('ativos')
  .join('localidades', 'ativos.codlocalidade', '=', 'localidades.id')
  .join('centro_custo', 'ativos.codcentrocusto', '=', 'centro_custo.id')
  .join('subgrupos', 'ativos.codsubgrupo', '=', 'subgrupos.id')
  .join('grupos', 'subgrupos.codgrupo', '=', 'grupos.id')
  .join('marcas', 'ativos.codmarca', '=', 'marcas.id')
  .select('centro_custo.descricao as centrocusto', 
    'localidades.descricao as localidade', 
    'grupos.descricao as grupo', 
    'subgrupos.descricao as subgrupo', 
    'marcas.descricao as marca', 
    'ativos.*')
  .where('ativos.codigo','=',codigo)
  return ativo
}

async function listaAtivosGeral(
  encontrado: string,
  status: string,
  ordem?: number
) {
  const query = db('ativos')
    .join('localidades', 'ativos.codlocalidade', '=', 'localidades.id')
    .join('centro_custo', 'ativos.codcentrocusto', '=', 'centro_custo.id')
    .join('subgrupos', 'ativos.codsubgrupo', '=', 'subgrupos.id')
    .join('marcas', 'ativos.codmarca', '=', 'marcas.id')
    .select(
      'ativos.id',
      'localidades.descricao as localidade',
      'centro_custo.descricao as centrocusto',
      'subgrupos.descricao as subgrupo',
      'ativos.codigo',
      'ativos.descricao as ativo',
      'ativos.status',
      'marcas.descricao as marca',
      'ativos.encontrado',
      'ativos.motivo_baixa'
    )
    if (status==='Baixado') {
      query.where('ativos.status','=',status)
    } else {
      query.whereIn('ativos.status',['Incluido','Alterado'])
    }
    query.andWhereRaw('ativos.encontrado=?',encontrado)
    switch (ordem) {
      case 1:
        query.orderBy('localidades.descricao', 'asc')
        query.orderBy('centro_custo.descricao', 'asc')
        query.orderBy('ativos.codigo', 'asc')
        break 
      case 2:
        query.orderBy('ativos.codigo', 'asc')
        break
      case 3:
        query.orderBy('subgrupos.descricao', 'asc')
        query.orderBy('marcas.descricao', 'asc')
        break
      default:
        query.orderBy('ativos.descricao', 'asc')
        break
    }
  return await query
}

async function listaAtivosConferencia(
  encontrado: string,
  codlocalidade?: number,
  ordem?: number
) {
  const query = db('ativos')
    .join('localidades', 'ativos.codlocalidade', '=', 'localidades.id')
    .join('centro_custo', 'ativos.codcentrocusto', '=', 'centro_custo.id')
    .join('subgrupos', 'ativos.codsubgrupo', '=', 'subgrupos.id')
    .join('marcas', 'ativos.codmarca', '=', 'marcas.id')
    .select(
      'ativos.id',
      'localidades.descricao as localidade',
      'centro_custo.descricao as centrocusto',
      'subgrupos.descricao as subgrupo',
      'ativos.codigo',
      'ativos.descricao as ativo',
      'ativos.status',
      'marcas.descricao as marca',
      'ativos.encontrado'
    )
    // Condições opcionais
    query.where('ativos.status','<>','Baixado')
    query.andWhereRaw('ativos.encontrado=?',encontrado)
    if (codlocalidade && codlocalidade > 0) {
      query.andWhere('ativos.codlocalidade', codlocalidade)
    }
    switch (ordem) {
      case 1:  //centro de custo
        query.orderBy('centro_custo.descricao', 'asc')
        query.orderBy('ativos.codigo', 'asc')
        break 
      case 2: //codigo do ativo
        query.orderBy('ativos.codigo', 'asc')
        break
      case 3: //sub-grupo e marca
        query.orderBy('subgrupos.descricao', 'asc')
        query.orderBy('marcas.descricao', 'asc')
        break
      default: //descricao do ativo
        query.orderBy('ativos.descricao', 'asc')
        query.orderBy('ativos.codigo', 'asc')
        break
    }
  return await query
}

async function totalAtivos(codlocalidade: number) {
  const result = await db('ativos')
  .select(
    db.raw(`count(*) as total`)
  )
  .where('ativos.status','<>','Baixado')
  .andWhere('ativos.codlocalidade','=',codlocalidade)
  .first()
  return result
}

async function ativosPorCentroCustoQtd(codlocalidade: number) {
  const ativosQtd = await db('ativos')
  .join('centro_custo', 'ativos.codcentrocusto', '=', 'centro_custo.id')
  .select('centro_custo.descricao as centrocusto')
  .count('ativos.codigo as quantidade')
  .where('ativos.status','<>','Baixados')
  .andWhere('ativos.codlocalidade','=', codlocalidade)
  .groupBy('centro_custo.descricao')
  .orderBy('centro_custo.descricao')
  return ativosQtd
}

async function ativosPorGrupo(codlocalidade: number) {
  const result = await db('ativos')
  .join('subgrupos', 'subgrupos.id', '=', 'ativos.codsubgrupo')
  .join('grupos', 'grupos.id', '=', 'subgrupos.codgrupo')
  .count('ativos.id as total')
  .select('grupos.descricao as grupo')
  .where('ativos.status','<>','Baixados')
  .andWhere('ativos.codlocalidade','=',codlocalidade)
  .groupBy('grupos.descricao')
  .orderBy('grupos.descricao')
  return result
}

async function ativosPorSubGrupo(codlocalidade: number) {
  const result = await db('ativos')
  .join('subgrupos', 'subgrupos.id', '=', 'ativos.codsubgrupo')
  .join('grupos', 'grupos.id', '=', 'subgrupos.codgrupo')
  .count('ativos.id as total')
  .select('grupos.descricao as grupo')
  .where('ativos.status','<>','Baixados')
  .andWhere('ativos.codlocalidade','=',codlocalidade)
  .groupBy('subgrupos.descricao')
  .orderBy('subgrupos.descricao')
  return result
}

async function ativosConferidosBaixados(codlocalidade: number) {
  const result = await db('ativos')
  .where('codlocalidade', codlocalidade)
  .select(
    db.raw(`
      COUNT(*) FILTER (WHERE encontrado = true AND status <> 'Baixado') AS encontrados,
      COUNT(*) FILTER (WHERE (encontrado = false OR encontrado IS NULL) AND status <> 'Baixado') AS nao_encontrados,
      COUNT(*) FILTER (WHERE status = 'Baixado') AS baixados
    `)
  )
  .first()
  return result
}

async function ativosValoresTotais(codlocalidade: number) {
  const result = await db('ativos')
  .where('codlocalidade', codlocalidade)
  .select(
    db.raw('ROUND(SUM(valor_aquisicao)::numeric, 2) as total_aquisicao'),
    db.raw('ROUND(SUM(depreciacao)::numeric, 2) as total_depreciacao'),
    db.raw('ROUND(SUM(valor_atual)::numeric, 2) as total_atual')
  )
  .first();
  return result
}

async function quantidadeAtivosPorAnoAquisicao(codlocalidade: number) {
  const result = await db('ativos as a')
  .where('codlocalidade', codlocalidade)
  .select(
    db.raw('EXTRACT(YEAR FROM a.aquisicao) AS ano'),
    db.raw('COUNT(a.id) AS total')
  )
  .whereNot('a.status', 'Baixado')
  .groupBy('ano')
  .orderBy('ano')
  return result
}

async function criar(dados: Omit<IAtivo, 'id'>) {
  const [ativo] = await db('ativos').insert({
    codlocalidade: dados.codlocalidade,
    codigo: dados.codigo,
    status: dados.status,
    motivo_baixa: dados.motivo_baixa,
    descricao: dados.descricao,
    aquisicao: dados.aquisicao,
    valor_aquisicao: dados.valor_aquisicao,
    valor_atual: dados.valor_atual,
    depreciacao: dados.depreciacao,
    codsubgrupo: dados.codsubgrupo,
    codcentrocusto: dados.codcentrocusto,
    codmarca: dados.codmarca,
    encontrado: dados.encontrado,
    responsavel: dados.responsavel
  })
  .returning('*')
  return ativo
}

async function alterar(dados: IAtivo) {
  const [ativo] = await db('ativos')
  .where({ id: Number(dados.id)})
  .update({
    codigo: dados.codigo,
    codlocalidade: dados.codlocalidade,
    status: dados.status,
    motivo_baixa: dados.motivo_baixa,
    descricao: dados.descricao,
    aquisicao: dados.aquisicao,
    valor_aquisicao: dados.valor_aquisicao,
    valor_atual: dados.valor_atual,
    depreciacao: dados.depreciacao,
    codsubgrupo: dados.codsubgrupo,
    codcentrocusto: dados.codcentrocusto,
    codmarca: dados.codmarca,
    encontrado: dados.encontrado,
    responsavel: dados.responsavel
  })
  .returning('*')
  return ativo
}

async function excluir(id: Number) {
  await db('ativos')
  .where({ id: id})
  .delete()
  return 
}

export const ativoService = { 
  listar, 
  totalAtivos,
  listaAtivosGeral,
  listaAtivosConferencia,
  ativosPorCentroCustoQtd, 
  ativosPorGrupo,
  ativosPorSubGrupo,
  ativosConferidosBaixados,
  ativosValoresTotais,
  quantidadeAtivosPorAnoAquisicao,
  buscarAtivo,
  criar, 
  alterar, 
  excluir 
}
