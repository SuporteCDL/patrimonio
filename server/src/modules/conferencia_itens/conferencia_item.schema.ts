import { z } from 'zod'

export const esquemaConferenciaItem = z.object({
  conferencia_id: z.coerce
    .number()
    .int("ID da conferência inválido")
    .positive("ID da conferência inválido"),

  patrimonio_id: z.coerce
    .number()
    .int("ID do patrimônio inválido")
    .positive("ID do patrimônio inválido"),

  encontrado: z.coerce.boolean(),

  observacao: z
    .string()
    .max(500, "Observação pode ter no máximo 500 caracteres")
    .optional(),

  data_verificacao: z
    .union([
      z.coerce.date(),
      z.literal(""),
      z.undefined(),
    ])
    .transform((val) => {
      if (val === "" || val === undefined) return undefined;
      return val;
    }),
});

export const esquemaUpdateConferenciaItem = esquemaConferenciaItem.extend({
  id: z.number().int().positive(),
})

export type EsquemaConferenciaItem = z.infer<typeof esquemaConferenciaItem>
export type EsquemaUpdateConferenciaItem = z.infer<typeof esquemaUpdateConferenciaItem>
