import { describe, expect, it } from 'vitest'

import { mapRegisterFormError } from '@/features/identity/utils/identityFormErrors'
import { AppApiError } from '@/shared/api/errors'

describe('mapRegisterFormError', () => {
  it('gắn EMAIL_ALREADY_EXISTS vào field email', () => {
    const error = new AppApiError({
      code: 'EMAIL_ALREADY_EXISTS',
      message: 'Email đã được sử dụng',
      status: 409,
    })

    expect(mapRegisterFormError(error)).toEqual({
      fieldErrors: { email: 'Email đã được sử dụng' },
    })
  })
})
