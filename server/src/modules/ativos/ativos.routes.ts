import { FastifyInstance } from "fastify"
import { createAtivo, 
  deleteAtivo, 
  getAtivo, 
  getAtivos, 
  getAtivosConferencia, 
  getAtivosGeral, 
  getAtivosPorCentroCustoQtd, 
  getAtivosPorGrupo, 
  getAtivosPorSubGrupo, 
  getAtivosValoresTotais,
  getAtivoConferencia,
  getQuantidadeAtivosPorAnoAquisicao, 
  getTotalAtivos, 
  updateAtivo, 
  getAtivosVSBaixados} from "./ativos.controller"

export async function ativosRoutes(app: FastifyInstance) {
  app.get('/', getAtivos)

  app.get('/:codigo', getAtivo)

  app.get('/buscaativo/:idconferencia/:codigo', getAtivoConferencia)
  
  app.get('/ativosconferencia', getAtivosConferencia)

  app.get('/ativosgeral', getAtivosGeral)
  
  app.get('/totalativos/:codlocalidade', getTotalAtivos)
  
  app.get('/ativoscentrocustoqtd/:codlocalidade', getAtivosPorCentroCustoQtd)
  
  app.get('/ativosporgrupo/:codlocalidade', getAtivosPorGrupo)

  app.get('/ativosporsubgrupo/:codlocalidade', getAtivosPorSubGrupo)
  
  app.get('/ativosvsbaixados/:codlocalidade', getAtivosVSBaixados)
  
  app.get('/ativosvalorestotais/:codlocalidade', getAtivosValoresTotais)

  app.get('/quantidadeativosporanoaquisicao/:codlocalidade', getQuantidadeAtivosPorAnoAquisicao)

  app.post('/', createAtivo)

  app.put('/', updateAtivo)
  
  app.delete('/:id', deleteAtivo)
}