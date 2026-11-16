import { z } from 'zod'

const environmentSchema = z.object({
  VITE_API_BASE_URL: z.string().trim().url().or(z.literal('')).default(''),
})

const parsedEnvironment = environmentSchema.parse(import.meta.env)

export const env = Object.freeze({
  apiBaseUrl: parsedEnvironment.VITE_API_BASE_URL.replace(/\/$/, ''),
})
