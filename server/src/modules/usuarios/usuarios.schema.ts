import { z } from 'zod'

export const esquemaLoginUsuario = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, 'É necessário informar minimo de 6 caracteres'),
})

export const esquemaCriacaoUsuario = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, 'É necessário informar minimo de 6 caracteres'),
})

export const esquemaAlteracaoUsuario = esquemaCriacaoUsuario.extend({
  id: z.number().int().positive({ message: 'ID inválido' }),
})

export const usuarioSchema = esquemaCriacaoUsuario.extend({
  id: z.number(),
})

export type EsquemaLoginUsuario = z.infer<typeof esquemaLoginUsuario>
export type EsquemaCriacaoUsuario = z.infer<typeof esquemaCriacaoUsuario>
export type EsquemaAtualizacaoUsuario = z.infer<typeof esquemaAlteracaoUsuario>
export type EsquemaUsuario = z.infer<typeof usuarioSchema>
