import { Field, Input, VStack } from '@chakra-ui/react'
import { useState } from 'react'

import { PasswordField } from '@/features/identity/components/PasswordField'
import { PasswordRequirements } from '@/features/identity/components/PasswordRequirements'
import {
  type RegisterFormValues,
  registerSchema,
} from '@/features/identity/schemas/identitySchemas'
import { useForm, zodResolver } from '@/shared/forms/schema'
import { PrimaryButton } from '@/shared/ui/PrimaryButton'

interface RegisterFormProps {
  isSubmitting?: boolean
  onSubmit?: (values: RegisterFormValues) => Promise<void> | void
}

export function RegisterForm({ isSubmitting = false, onSubmit }: RegisterFormProps) {
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const {
    formState: { errors, isSubmitting: isFormSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm<RegisterFormValues>({
    defaultValues: { confirmPassword: '', email: '', fullName: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(registerSchema),
  })
  const password = watch('password')
  const submitting = isSubmitting || isFormSubmitting

  return (
    <form noValidate onSubmit={handleSubmit(async (values) => onSubmit?.(values))}>
      <VStack align="stretch" gap="5">
        <Field.Root invalid={Boolean(errors.fullName)}>
          <Field.Label color="text.body" fontWeight="semibold">
            Họ và tên
          </Field.Label>
          <Input
            {...register('fullName')}
            aria-describedby={errors.fullName ? 'register-name-error' : undefined}
            autoComplete="name"
            bg="surface.card"
            borderColor="border.default"
            id="register-name"
            placeholder="Nguyễn Bloom"
            _invalid={{ borderColor: 'primary.main' }}
          />
          {errors.fullName ? (
            <Field.ErrorText color="primary.main" id="register-name-error">{errors.fullName.message}</Field.ErrorText>
          ) : null}
        </Field.Root>

        <Field.Root invalid={Boolean(errors.email)}>
          <Field.Label color="text.body" fontWeight="semibold">
            Email
          </Field.Label>
          <Input
            {...register('email')}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
            autoComplete="email"
            bg="surface.card"
            borderColor="border.default"
            id="register-email"
            inputMode="email"
            placeholder="ban@example.com"
            type="email"
            _invalid={{ borderColor: 'primary.main' }}
          />
          {errors.email ? (
            <Field.ErrorText color="primary.main" id="register-email-error">{errors.email.message}</Field.ErrorText>
          ) : null}
        </Field.Root>

        <PasswordField
          autoComplete="new-password"
          error={errors.password?.message}
          id="register-password"
          label="Mật khẩu"
          onFocus={() => setShowPasswordRequirements(true)}
          placeholder="Tạo mật khẩu an toàn"
          registration={register('password')}
        />

        {showPasswordRequirements || password.length > 0 ? (
          <PasswordRequirements password={password} />
        ) : null}

        <PasswordField
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          id="register-confirm-password"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          registration={register('confirmPassword')}
        />

        <PrimaryButton
          disabled={submitting}
          loading={submitting}
          loadingText="Đang tạo tài khoản…"
          size="lg"
          type="submit"
          width="full"
        >
          Tạo tài khoản
        </PrimaryButton>
      </VStack>
    </form>
  )
}
