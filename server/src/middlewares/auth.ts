import jwt from 'jsonwebtoken';
import { FastifyReply, FastifyRequest } from 'fastify';

interface JWTPayload {
  id: number;
  email: string;
}

export async function autenticar(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: 'Token ausente' });
  }

  const [, token] = authHeader.split(' ');

  try {
    if (!token) {
      return reply.status(401).send({ message: 'Token ausente' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não configurado nas variáveis de ambiente');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    req.user = decoded;
  } catch {
    return reply.status(401).send({ message: 'Token inválido ou expirado' });
  }
}