import { FastifyInstance } from 'fastify'
import { usuariosRoutes } from '../modules/usuarios/uruarios.routes'
import { gruposRoutes } from '../modules/grupos/grupos.routes'
import { ativosRoutes } from '../modules/ativos/ativos.routes'
import { subGruposRoutes } from '../modules/subgrupos/subgrupos.routes'
import { centroCustoRoutes } from '../modules/centrocusto/centrocusto.routes'
import { localidadesRoutes } from '../modules/localidades/localidades.routes'
import { marcasRoutes } from '../modules/marcas/marcas.routes'
import { situacaoRoutes } from '../modules/situacoes/situacao.routes'
import { conferenciaRoutes } from '../modules/conferencia/conferencia.routes'
import { conferenciaItemRoutes } from '../modules/conferencia_itens/conferencia_item.routes'

export async function registerRoutes(app: FastifyInstance) {
  app.register(localidadesRoutes, { prefix: '/localidades' })
  app.register(gruposRoutes, { prefix: '/grupos' })
  app.register(subGruposRoutes, { prefix: '/subgrupos' })
  app.register(ativosRoutes, { prefix: '/ativos' })
  app.register(centroCustoRoutes, { prefix: '/centrocusto' })
  app.register(marcasRoutes, { prefix: '/marcas' })
  app.register(usuariosRoutes, { prefix: '/usuarios' })
  app.register(situacaoRoutes, { prefix: '/situacoes' })
  app.register(conferenciaRoutes, { prefix: '/conferencia' })
  app.register(conferenciaItemRoutes, { prefix: '/conferenciaitem' })
}
