import { describe, expect, it } from 'vitest'

import { normalizeApiError } from '@/shared/api/errors'

describe('normalizeApiError', () => {
  it('chuyển error envelope của backend thành lỗi ứng dụng ổn định', () => {
    const error = {
      isAxiosError: true,
      message: 'Request failed with status code 409',
      response: {
        data: {
          success: false,
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: 'Email đã tồn tại',
          },
        },
        status: 409,
      },
    }

    expect(normalizeApiError(error)).toMatchObject({
      code: 'EMAIL_ALREADY_EXISTS',
      message: 'Email đã tồn tại',
      status: 409,
    })
  })

  it('trả thông báo ổn định khi không thể kết nối máy chủ', () => {
    const error = {
      code: 'ERR_NETWORK',
      isAxiosError: true,
      message: 'Network Error',
    }

    expect(normalizeApiError(error)).toMatchObject({
      code: 'NETWORK_ERROR',
      message: 'Không thể kết nối tới máy chủ. Vui lòng thử lại.',
    })
  })

  it('chuyển validation issues thành lỗi theo field', () => {
    const error = {
      isAxiosError: true,
      response: {
        data: {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dữ liệu không hợp lệ',
            details: {
              issues: [{ path: 'email', message: 'Email chưa đúng định dạng' }],
            },
          },
        },
        status: 422,
      },
    }

    expect(normalizeApiError(error).fieldIssues).toEqual({
      email: 'Email chưa đúng định dạng',
    })
  })
})
