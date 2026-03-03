import { FastifyInstance } from 'fastify'
import { getUsers, createUser, updateUser, deleteUser, loginUser } from './usuarios.controller'

export async function usuariosRoutes(app: FastifyInstance) {
  app.get('/', getUsers)

  app.post('/login', loginUser)

  app.post('/', createUser)

  app.put('/:id', updateUser)

  app.delete('/:id', deleteUser)
}
