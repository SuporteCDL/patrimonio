import { FastifyReply, FastifyRequest } from 'fastify'
import { logar, usuarioService } from './usuarios.service'
import { esquemaCriacaoUsuario, esquemaLoginUsuario } from './usuarios.schema'
import { hash } from 'bcrypt'
import { randomInt } from 'crypto'

interface UpdateUsuarioParam {
  id: number
}

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
  const usuarios = await usuarioService.listar()
  return reply.send(usuarios)
}

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const usuario = await logar(esquemaLoginUsuario.parse(request.body))
    
    if (!usuario) {
      return reply.status(401).send({ message: 'Email ou senha incorretos' });
    }

    return reply.send({ message: 'Login realizado com sucesso', usuario });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: 'Erro interno no servidor' });
  }
}

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const parsed = esquemaCriacaoUsuario.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const randomSalt = randomInt(10, 16)
  const passwordHash = await hash(String(parsed.data.password), randomSalt)
  const dadosUsuario = {
    nome: parsed.data.nome,
    email: parsed.data.email,
    password: passwordHash
  }
  const novoUsuario = await usuarioService.criar(dadosUsuario)
  return reply.code(201).send(novoUsuario)
}

export async function updateUser(request: FastifyRequest<{ Params: UpdateUsuarioParam }>, reply: FastifyReply) {
  const { id } = request.params
  const parsed = esquemaCriacaoUsuario.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      details: parsed.error.format(),
    })
  }
  const usuarioAtualizado = await usuarioService.alterar({
    id: Number(id),
    ...parsed.data
  })
  return reply.code(201).send(usuarioAtualizado)
}

export async function deleteUser(request: FastifyRequest<{ Params: UpdateUsuarioParam }>, reply: FastifyReply) {
  const { id } = request.params
  if (!id) {
    return reply.status(400).send({
      error: 'Erro de validação',
    })
  }
  await usuarioService.excluir(id)
  return reply.code(201).send('Excluído com sucesso')
}