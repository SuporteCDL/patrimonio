import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken';
import { db } from "../../database/knex" 

interface ILogin {
  email: string
  password: string
}

interface IUsuario {
  id: number
  nome: string
  email: string
  password: string
}

async function listar() {
  return await db('usuarios').select('*').orderBy('nome')
}

export async function logar(usuarioBody: ILogin) {
  const usuarioDB = await db('usuarios')
    .select('*')
    .where({ email: usuarioBody.email })
    .first();

  if (!usuarioDB) {
    return null; // Usuário não encontrado
  }
  const senhaCorreta = await compare(usuarioBody.password, usuarioDB.password);
  if (!senhaCorreta) {
    return null; // Senha incorreta
  }
  const { password, ...dadosSemSenha } = usuarioDB;

  const token = jwt.sign(
    { id: usuarioDB.id, email: usuarioDB.email },
    process.env.JWT_SECRET || 'segredo_dev',
    { expiresIn: '1h' }
  );

  return { usuario: dadosSemSenha, token };
  // return dadosSemSenha;
}

async function criar(dados: Omit<IUsuario, 'id'>) {
  const [usuario] = await db('usuarios')
    .insert({
      nome: dados.nome,
      email: dados.email,
      password: dados.password,
    })
    .returning('*')
  return usuario
}

async function alterar(dados: IUsuario) {
  const [usuario] = await db('usuarios')
    .where({ id: Number(dados.id) })
    .update({
      nome: dados.nome,
      email: dados.email,
    })
    .returning('*')

  return usuario
}

async function excluir(id: Number) {
  const [usuario] = await db('usuarios')
    .where({ id: id })
    .delete()
    .returning('*')

  return usuario
}

export const usuarioService = { listar, logar, criar, alterar, excluir }