import { Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { AuthLayout } from '@/features/identity/components/AuthLayout'
import { RegisterForm } from '@/features/identity/components/RegisterForm'

export function RegisterPage() {
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
      <RegisterForm />
    </AuthLayout>
  )
}
