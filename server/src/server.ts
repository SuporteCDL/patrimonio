import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import path from 'path'
import { registerRoutes } from './app/routes'
import cors from '@fastify/cors'

const PORT=5051

const app = Fastify({
  logger: true
})

app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // <-- importante
})

// app.register(registerRoutes)
app.register(registerRoutes, { prefix: "/api" })

// 🔥 Servir frontend (build do Vite)
app.register(fastifyStatic, {
  root: path.join(__dirname, "../../web/dist"), // ajuste se necessário
})

app.listen({ host: '0.0.0.0', port: PORT }).then(() => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})


