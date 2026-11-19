import axios from 'axios'
import { z } from 'zod'

import { apiFailureSchema } from '@/shared/api/contracts'

const validationDetailsSchema = z.object({
  issues: z.array(
    z.object({
      message: z.string(),
      path: z.string(),
    }),
  ),
})

function getFieldIssues(details: unknown): Record<string, string> | undefined {
  const parsedDetails = validationDetailsSchema.safeParse(details)
  if (!parsedDetails.success) return undefined

  return Object.fromEntries(
    parsedDetails.data.issues.map((issue) => [issue.path, issue.message]),
  )
}

export class AppApiError extends Error {
  readonly code: string
  readonly details?: unknown
  readonly fieldIssues?: Record<string, string>
  readonly status?: number

  constructor(options: {
    code: string
    details?: unknown
    fieldIssues?: Record<string, string>
    message: string
    status?: number
  }) {
    super(options.message)
    this.name = 'AppApiError'
    this.code = options.code
    this.details = options.details
    this.fieldIssues = options.fieldIssues
    this.status = options.status
  }
}

export function normalizeApiError(error: unknown): AppApiError {
  if (error instanceof AppApiError) return error

  if (axios.isAxiosError(error)) {
    const parsedFailure = apiFailureSchema.safeParse(error.response?.data)

    if (parsedFailure.success) {
      return new AppApiError({
        code: parsedFailure.data.error.code,
        details: parsedFailure.data.error.details,
        fieldIssues: getFieldIssues(parsedFailure.data.error.details),
        message: parsedFailure.data.error.message,
        status: error.response?.status,
      })
    }

    if (!error.response || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new AppApiError({
        code: 'NETWORK_ERROR',
        message: 'Không thể kết nối tới máy chủ. Vui lòng thử lại.',
      })
    }
  }

  return new AppApiError({
    code: 'UNKNOWN_ERROR',
    message: 'Đã xảy ra lỗi. Vui lòng thử lại.',
  })
}
