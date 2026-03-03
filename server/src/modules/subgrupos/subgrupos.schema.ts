import { z } from "zod"

export const esquemaCriacaoSubGrupo = z.object({
  codgrupo: z.number().positive({message: 'O nome deve ter pelo menos 3 caracteres'}),
  descricao: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
})

export const esquemaAlteracaoSubGrupo = esquemaCriacaoSubGrupo.extend({
  id: z.number().int().positive({ message : 'ID inválido' }),
})

export const esquemaSubGrupo = esquemaCriacaoSubGrupo.extend({
  id: z.number(),
})

export type EsquemaCriacaoSubGrupo = z.infer<typeof esquemaCriacaoSubGrupo>
export type EsquemaAlteracaoSubGrupo = z.infer<typeof esquemaAlteracaoSubGrupo>
export type EsquemaSubGrupo = z.infer<typeof esquemaSubGrupo>
