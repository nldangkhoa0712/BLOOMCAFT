import type { AppApiError } from '@/shared/api/errors'

export function mapRegisterFormError(error: AppApiError): {
  fieldErrors?: Partial<Record<'email' | 'fullName' | 'password', string>>
  formError?: string
} {
  const fieldErrors: Partial<Record<'email' | 'fullName' | 'password', string>> = {}

  if (error.code === 'EMAIL_ALREADY_EXISTS') fieldErrors.email = error.message
  if (error.fieldIssues?.email) fieldErrors.email = error.fieldIssues.email
  if (error.fieldIssues?.fullName) fieldErrors.fullName = error.fieldIssues.fullName
  if (error.fieldIssues?.password) fieldErrors.password = error.fieldIssues.password

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }
  return { formError: error.message }
}
