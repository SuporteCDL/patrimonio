import { z } from 'zod'

export const esquemaCriacaoConferencia = z
  .object({
    descricao: z
      .string()
      .min(3, "A descrição deve ter pelo menos 3 caracteres"),
    data_inicio: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
    data_fim: z      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
    responsavel: z
      .string()
      .min(3, "Informe o responsável"),
    status: z.union([
      z.literal("Aberta"),
      z.literal("Finalizada"),
    ]),
  })
  .refine((data) => data.data_fim >= data.data_inicio, {
    message: "A data final não pode ser menor que a inicial",
    path: ["data_fim"],
  })

  export const esquemaConferencia = esquemaCriacaoConferencia.extend({
    id: z.number().int().positive({ message: 'ID inválido' })
  })

  export type EsquemaCriacaoConferencia = z.infer<typeof esquemaCriacaoConferencia>
  export type EsquemaConferencia = z.infer<typeof esquemaConferencia>
