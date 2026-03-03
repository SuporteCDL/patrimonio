import { z } from 'zod'

export const esquemaCriacaoMarca = z.object({
  descricao: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
})

export const esquemaAlteracaoMarca = esquemaCriacaoMarca.extend({
  id: z.number().int().positive({ message : 'ID inválido' }),
})

export const esquemaMarca = esquemaCriacaoMarca.extend({
  id: z.number(),
})

export type EsquemaCriacaoMarca = z.infer<typeof esquemaCriacaoMarca>
export type EsquemaAlteracaoMarca = z.infer<typeof esquemaAlteracaoMarca>
export type EsquemaMarca = z.infer<typeof esquemaMarca>