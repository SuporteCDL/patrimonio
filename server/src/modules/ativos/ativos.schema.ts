import z from "zod";

export const ativosQuerySchema = z.object({
  codlocalidade: z.coerce.number().min(1, 'codlocalidade é obrigatório'),
  codcentrocusto: z.coerce.number().optional(),
  codsubgrupo: z.coerce.number().optional(),
  codmarca: z.coerce.number().optional(),
  codigo: z.string().optional()
})

export const ativosConferenciaQuerySchema = z.object({
  encontrado: z.string(),
  conferenciaid: z.coerce.number().min(1, 'codigo da conferencia obrigatório'),
  codlocalidade: z.coerce.number().min(1, 'codlocalidade é obrigatório'),
  ordem: z.coerce.number()
})

export const ativosGeralQuerySchema = z.object({
  status: z.string(),
  ordem: z.coerce.number()
})

export const esquemaCriacaoAtivo = z.object({
  codlocalidade: z.number(),
  codigo: z.string().min(1, 'Favor informar no mínimo 1 caracter'),
  status: z.string().min(3, 'Informe pelo menos 3 caracteres do Status'),
  descricao: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  aquisicao: z.string(),
  valor_aquisicao: z.number(),
  valor_atual: z.number(),
  depreciacao: z.number(),
  codsubgrupo: z.number(),
  codcentrocusto: z.number(),
  codmarca: z.number(),
  motivo_baixa: z.string(),
  responsavel: z.string()
})

export const esquemaAlteracaoAtivo = esquemaCriacaoAtivo.extend({
  id: z.number().int().positive({ message : 'ID inválido' }),
})

export const esquemaAtivo = esquemaCriacaoAtivo.extend({
  id: z.number(),
})

export type AtivosQuerySchema = z.infer<typeof ativosQuerySchema>
export type AtivosConferenciaQuerySchema = z.infer<typeof ativosConferenciaQuerySchema>
export type AtivosGeralQuerySchema = z.infer<typeof ativosGeralQuerySchema>
export type EsquemaCriacaoAtivo = z.infer<typeof esquemaCriacaoAtivo>
export type EsquemaAlteracaoAtivo = z.infer<typeof esquemaAlteracaoAtivo>
export type EsquemaAtivo = z.infer<typeof esquemaAtivo>
