import { Field, Input, VStack } from '@chakra-ui/react'
import { useState } from 'react'

import { FormErrorAlert } from '@/features/identity/components/FormErrorAlert'
import { PasswordField } from '@/features/identity/components/PasswordField'
import { type LoginFormValues, loginSchema } from '@/features/identity/schemas/identitySchemas'
import { normalizeApiError } from '@/shared/api/errors'
import { useForm, zodResolver } from '@/shared/forms/schema'
import { PrimaryButton } from '@/shared/ui/PrimaryButton'

interface LoginFormProps {
  defaultEmail?: string
  isSubmitting?: boolean
  onSubmit?: (values: LoginFormValues) => Promise<void> | void
}

export function LoginForm({ defaultEmail = '', isSubmitting = false, onSubmit }: LoginFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const {
    clearErrors,
    formState: { errors, isSubmitting: isFormSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: { email: defaultEmail, password: '' },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(loginSchema),
  })

  const submitting = isSubmitting || isFormSubmitting
  const emailRegistration = register('email')

  const submit = async (values: LoginFormValues) => {
    setFormError(null)
    clearErrors()

    try {
      await onSubmit?.(values)
    } catch (error) {
      const apiError = normalizeApiError(error)
      const emailError = apiError.fieldIssues?.email
      const passwordError = apiError.fieldIssues?.password
      if (emailError) {
        setError('email', { message: emailError, type: 'server' }, { shouldFocus: true })
      }
      if (passwordError) {
        setError('password', { message: passwordError, type: 'server' })
      }
      if (emailError || passwordError) return

      setFormError(apiError.message)
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <VStack align="stretch" gap="5">
        {formError ? <FormErrorAlert message={formError} /> : null}
        <Field.Root invalid={Boolean(errors.email)}>
          <Field.Label color="text.body" fontWeight="semibold">
            Email
          </Field.Label>
          <Input
            {...emailRegistration}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            autoComplete="email"
            bg="surface.card"
            borderColor="border.default"
            id="login-email"
            inputMode="email"
            onChange={(event) => {
              setFormError(null)
              if (errors.email?.type === 'server') clearErrors('email')
              void emailRegistration.onChange(event)
            }}
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
          onValueChange={() => {
            setFormError(null)
            if (errors.password?.type === 'server') clearErrors('password')
          }}
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
