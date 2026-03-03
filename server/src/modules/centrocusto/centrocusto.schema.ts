import { z } from 'zod'

export const esquemaCriacaoCentroCusto = z.object({
  descricao: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
})

export const esquemaAlteracaoCentroCusto = esquemaCriacaoCentroCusto.extend({
  id: z.number().int().positive({ message : 'ID inválido' }),
})

export const esquemaCentroCusto = esquemaCriacaoCentroCusto.extend({
  id: z.number(),
})

export type EsquemaCriacaoCentroCusto = z.infer<typeof esquemaCriacaoCentroCusto>
export type EsquemaAlteracaoCentroCusto = z.infer<typeof esquemaAlteracaoCentroCusto>
export type EsquemaCentroCusto = z.infer<typeof esquemaCentroCusto>