import { z } from 'zod'

export const esquemaCriacaoGrupo = z.object({
  descricao: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
})

export const esquemaAlteracaoGrupo = esquemaCriacaoGrupo.extend({
  id: z.number().int().positive({ message : 'ID inválido' }),
})

export const esquemaGrupo = esquemaCriacaoGrupo.extend({
  id: z.number(),
})

export type EsquemaCriacaoGrupo = z.infer<typeof esquemaCriacaoGrupo>
export type EsquemaAlteracaoGrupo = z.infer<typeof esquemaAlteracaoGrupo>
export type EsquemaGrupo = z.infer<typeof esquemaGrupo>