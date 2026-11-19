import { Field, Input, VStack } from '@chakra-ui/react'
import { useState } from 'react'

import { FormErrorAlert } from '@/features/identity/components/FormErrorAlert'
import { PasswordField } from '@/features/identity/components/PasswordField'
import { PasswordRequirements } from '@/features/identity/components/PasswordRequirements'
import {
  type RegisterFormValues,
  registerSchema,
} from '@/features/identity/schemas/identitySchemas'
import { mapRegisterFormError } from '@/features/identity/utils/identityFormErrors'
import { normalizeApiError } from '@/shared/api/errors'
import { useForm, zodResolver } from '@/shared/forms/schema'
import { PrimaryButton } from '@/shared/ui/PrimaryButton'

interface RegisterFormProps {
  isSubmitting?: boolean
  onSubmit?: (values: RegisterFormValues) => Promise<void> | void
}

export function RegisterForm({ isSubmitting = false, onSubmit }: RegisterFormProps) {
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const {
    clearErrors,
    formState: { errors, isSubmitting: isFormSubmitting },
    handleSubmit,
    register,
    setError,
    watch,
  } = useForm<RegisterFormValues>({
    defaultValues: { confirmPassword: '', email: '', fullName: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(registerSchema),
  })
  const password = watch('password')
  const submitting = isSubmitting || isFormSubmitting
  const emailRegistration = register('email')
  const fullNameRegistration = register('fullName')

  const submit = async (values: RegisterFormValues) => {
    setFormError(null)
    clearErrors()

    try {
      await onSubmit?.(values)
    } catch (error) {
      const apiError = normalizeApiError(error)
      const mappedError = mapRegisterFormError(apiError)
      const emailError = mappedError.fieldErrors?.email
      const fullNameError = mappedError.fieldErrors?.fullName
      const passwordError = mappedError.fieldErrors?.password

      if (emailError) {
        setError('email', { message: emailError, type: 'server' }, { shouldFocus: true })
      }
      if (fullNameError) {
        setError('fullName', { message: fullNameError, type: 'server' })
      }
      if (passwordError) {
        setError('password', { message: passwordError, type: 'server' })
      }
      if (emailError || fullNameError || passwordError) return

      setFormError(mappedError.formError ?? apiError.message)
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <VStack align="stretch" gap="5">
        {formError ? <FormErrorAlert message={formError} /> : null}
        <Field.Root invalid={Boolean(errors.fullName)}>
          <Field.Label color="text.body" fontWeight="semibold">
            Họ và tên
          </Field.Label>
          <Input
            {...fullNameRegistration}
            aria-describedby={errors.fullName ? 'register-name-error' : undefined}
            autoComplete="name"
            bg="surface.card"
            borderColor="border.default"
            id="register-name"
            onChange={(event) => {
              setFormError(null)
              if (errors.fullName?.type === 'server') clearErrors('fullName')
              void fullNameRegistration.onChange(event)
            }}
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
            {...emailRegistration}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
            autoComplete="email"
            bg="surface.card"
            borderColor="border.default"
            id="register-email"
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
            <Field.ErrorText color="primary.main" id="register-email-error">{errors.email.message}</Field.ErrorText>
          ) : null}
        </Field.Root>

        <PasswordField
          autoComplete="new-password"
          error={errors.password?.message}
          id="register-password"
          label="Mật khẩu"
          onFocus={() => setShowPasswordRequirements(true)}
          onValueChange={() => {
            setFormError(null)
            if (errors.password?.type === 'server') clearErrors('password')
          }}
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
          onValueChange={() => setFormError(null)}
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
