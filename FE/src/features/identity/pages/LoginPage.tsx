import { Text } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'

import { AuthLayout } from '@/features/identity/components/AuthLayout'
import { LoginForm } from '@/features/identity/components/LoginForm'

interface LoginLocationState {
  email?: string
  registrationSucceeded?: boolean
}

export function LoginPage() {
  const location = useLocation()
  const state = location.state as LoginLocationState | null

  return (
    <AuthLayout
      description="Đăng nhập để tiếp tục hành trình cùng BloomCraft."
      eyebrow="Tài khoản của bạn"
      title="Chào mừng bạn trở lại"
      footer={
        <Text color="text.muted" textAlign="center">
          Chưa có tài khoản?{' '}
          <Link className="font-semibold text-primary-main underline-offset-4 hover:underline" to="/register">
            Tạo tài khoản
          </Link>
        </Text>
      }
    >
      {state?.registrationSucceeded ? (
        <Text
          aria-live="polite"
          bg="accent.sage"
          borderColor="border.default"
          borderRadius="lg"
          borderWidth="1px"
          color="accent.onSage"
          fontSize="sm"
          p="3"
        >
          Tạo tài khoản thành công. Bạn có thể đăng nhập ngay.
        </Text>
      ) : null}
      <LoginForm defaultEmail={state?.email} />
    </AuthLayout>
  )
}
