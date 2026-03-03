import { z } from 'zod'

export const esquemaCriacaoSituacao = z.object({
  situacao: z.string().min(3, 'Favor informar no mínimo 3 caracteres'),
})

export const esquemaAlteracaoSituacao = esquemaCriacaoSituacao.extend({
  id: z.number().int().positive({ message : 'ID inválido'})
})

export type EsquemaCriacaoSituacao = z.infer<typeof esquemaCriacaoSituacao>
export type EsquemaAlteracaoSituacao = z.infer<typeof esquemaAlteracaoSituacao>