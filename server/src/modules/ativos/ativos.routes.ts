import { FastifyInstance } from "fastify"
import { createAtivo, 
  deleteAtivo, 
  getAtivo, 
  getAtivos, 
  getAtivosConferencia, 
  getAtivosConferidosBaixados, 
  getAtivosGeral, 
  getAtivosPorCentroCustoQtd, 
  getAtivosPorGrupo, 
  getAtivosPorSubGrupo, 
  getAtivosValoresTotais,
  getQuantidadeAtivosPorAnoAquisicao, 
  getTotalAtivos, 
  updateAtivo } from "./ativos.controller"

export async function ativosRoutes(app: FastifyInstance) {
  app.get('/', getAtivos)

  app.get('/buscaativo/:codigo', getAtivo)
  
  app.get('/ativosconferencia', getAtivosConferencia)

  app.get('/ativosgeral', getAtivosGeral)
  
  app.get('/totalativos/:codlocalidade', getTotalAtivos)
  
  app.get('/ativoscentrocustoqtd/:codlocalidade', getAtivosPorCentroCustoQtd)
  
  app.get('/ativosporgrupo/:codlocalidade', getAtivosPorGrupo)

  app.get('/ativosporsubgrupo/:codlocalidade', getAtivosPorSubGrupo)
  
  app.get('/ativosconferidosbaixados/:codlocalidade', getAtivosConferidosBaixados)

  app.get('/ativosvalorestotais/:codlocalidade', getAtivosValoresTotais)

  app.get('/quantidadeativosporanoaquisicao/:codlocalidade', getQuantidadeAtivosPorAnoAquisicao)

  app.post('/', createAtivo)

  app.put('/', updateAtivo)
  
  app.delete('/:id', deleteAtivo)
}