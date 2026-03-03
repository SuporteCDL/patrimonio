import { z } from 'zod'

export const esquemaCriacaoLocalidade = z.object({
  descricao: z.string().min(3, 'O nome da localidade deve ter pelo menos 3 caracteres'),
})

export const esquemaAlteracaoLocalidade = esquemaCriacaoLocalidade.extend({
  id: z.number().int().positive({ message : 'ID inválido' }),
})

export const esquemaLocalidade = esquemaCriacaoLocalidade.extend({
  id: z.number(),
})

export type EsquemaCriacaoLocalidade = z.infer<typeof esquemaCriacaoLocalidade>
export type EsquemaAlteracaoLocalidade = z.infer<typeof esquemaAlteracaoLocalidade>
export type EsquemaLocalidade = z.infer<typeof esquemaLocalidade>
