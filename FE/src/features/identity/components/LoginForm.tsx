import { Field, Input, VStack } from '@chakra-ui/react'

import { PasswordField } from '@/features/identity/components/PasswordField'
import { type LoginFormValues, loginSchema } from '@/features/identity/schemas/identitySchemas'
import { useForm, zodResolver } from '@/shared/forms/schema'
import { PrimaryButton } from '@/shared/ui/PrimaryButton'

interface LoginFormProps {
  defaultEmail?: string
  isSubmitting?: boolean
  onSubmit?: (values: LoginFormValues) => Promise<void> | void
}

export function LoginForm({ defaultEmail = '', isSubmitting = false, onSubmit }: LoginFormProps) {
  const {
    formState: { errors, isSubmitting: isFormSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: { email: defaultEmail, password: '' },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(loginSchema),
  })

  const submitting = isSubmitting || isFormSubmitting

  return (
    <form noValidate onSubmit={handleSubmit(async (values) => onSubmit?.(values))}>
      <VStack align="stretch" gap="5">
        <Field.Root invalid={Boolean(errors.email)}>
          <Field.Label color="text.body" fontWeight="semibold">
            Email
          </Field.Label>
          <Input
            {...register('email')}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            autoComplete="email"
            bg="surface.card"
            borderColor="border.default"
            id="login-email"
            inputMode="email"
            placeholder="ban@example.com"
            type="email"
            _invalid={{ borderColor: 'primary.main' }}
          />
          {errors.email ? (
            <Field.ErrorText color="primary.main" id="login-email-error">{errors.email.message}</Field.ErrorText>
          ) : null}
        </Field.Root>

        <PasswordField
          autoComplete="current-password"
          error={errors.password?.message}
          id="login-password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu của bạn"
          registration={register('password')}
        />

        <PrimaryButton
          disabled={submitting}
          loading={submitting}
          loadingText="Đang đăng nhập…"
          size="lg"
          type="submit"
          width="full"
        >
          Đăng nhập
        </PrimaryButton>
      </VStack>
    </form>
  )
}
