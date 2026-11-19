import { Text } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthLayout } from '@/features/identity/components/AuthLayout'
import { RegisterForm } from '@/features/identity/components/RegisterForm'
import { useRegisterMutation } from '@/features/identity/hooks/useRegisterMutation'
import type { RegisterFormValues } from '@/features/identity/schemas/identitySchemas'

export function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegisterMutation()

  const handleRegister = async (values: RegisterFormValues) => {
    await registerMutation.mutateAsync(values)
    navigate('/login', {
      replace: true,
      state: { email: values.email, registrationSucceeded: true },
    })
  }

  return (
    <AuthLayout
      description="Lưu lại những lựa chọn hoa dành riêng cho bạn."
      eyebrow="Bắt đầu cùng BloomCraft"
      title="Tạo tài khoản BloomCraft"
      footer={
        <Text color="text.muted" textAlign="center">
          Đã có tài khoản?{' '}
          <Link className="font-semibold text-primary-main underline-offset-4 hover:underline" to="/login">
            Đăng nhập
          </Link>
        </Text>
      }
    >
      <RegisterForm onSubmit={handleRegister} />
    </AuthLayout>
  )
}
