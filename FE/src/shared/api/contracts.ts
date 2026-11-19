import { z } from 'zod'

export const apiFailureSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
})

export const statusSuccessSchema = z.object({
  success: z.literal(true),
})

export function apiSuccessSchema<TSchema extends z.ZodType>(dataSchema: TSchema) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
  })
}
