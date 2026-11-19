import { Avatar, Button, Field, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'

import { FormErrorAlert } from '@/features/identity/components/FormErrorAlert'
import {
  type ProfileFormValues,
  profileSchema,
} from '@/features/identity/schemas/identitySchemas'
import { useForm, zodResolver } from '@/shared/forms/schema'
import { normalizeApiError } from '@/shared/api/errors'
import { PrimaryButton } from '@/shared/ui/PrimaryButton'

interface ProfileFormProps {
  avatarUrl?: string | null
  defaultValues: ProfileFormValues
  email: string
  isSubmitting?: boolean
  onSubmit?: (values: ProfileFormValues) => Promise<void> | void
}

export function ProfileForm({
  avatarUrl,
  defaultValues,
  email,
  isSubmitting = false,
  onSubmit,
}: ProfileFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const {
    clearErrors,
    formState: { errors, isDirty, isSubmitting: isFormSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ProfileFormValues>({
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(profileSchema),
  })
  const submitting = isSubmitting || isFormSubmitting
  const fullNameRegistration = register('fullName')
  const phoneRegistration = register('phone')

  const submit = async (values: ProfileFormValues) => {
    setFormError(null)
    setShowSuccess(false)
    clearErrors()

    try {
      await onSubmit?.(values)
      reset(values)
      setShowSuccess(true)
    } catch (error) {
      const apiError = normalizeApiError(error)
      const fullNameError = apiError.fieldIssues?.fullName
      const phoneError = apiError.fieldIssues?.phone
      if (fullNameError) setError('fullName', { message: fullNameError, type: 'server' })
      if (phoneError) setError('phone', { message: phoneError, type: 'server' })
      if (fullNameError || phoneError) return
      setFormError(apiError.message)
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <VStack align="stretch" gap="6">
        {formError ? <FormErrorAlert message={formError} /> : null}
        {showSuccess ? (
          <Text
            aria-live="polite"
            bg="accent.sage"
            borderRadius="lg"
            color="accent.onSage"
            fontSize="sm"
            p="3"
          >
            Thông tin tài khoản đã được cập nhật.
          </Text>
        ) : null}
        <HStack gap="4">
          <Avatar.Root bg="primary.soft" color="primary.onSoft" size="xl">
            <Avatar.Fallback name={defaultValues.fullName} />
            {avatarUrl ? <Avatar.Image alt="" src={avatarUrl} /> : null}
          </Avatar.Root>
          <VStack align="start" gap="1">
            <Text color="text.heading" fontWeight="semibold">
              {defaultValues.fullName}
            </Text>
            <Text color="text.muted" fontSize="sm">
              Ảnh đại diện sẽ được hỗ trợ trong phiên bản sau.
            </Text>
          </VStack>
        </HStack>

        <Field.Root>
          <Field.Label color="text.body" fontWeight="semibold">
            Email
          </Field.Label>
          <Input
            aria-readonly="true"
            bg="background.secondary"
            borderColor="border.default"
            color="text.muted"
            readOnly
            value={email}
          />
          <Field.HelperText color="text.muted">Email đăng nhập hiện chưa thể thay đổi.</Field.HelperText>
        </Field.Root>

        <Field.Root invalid={Boolean(errors.fullName)}>
          <Field.Label color="text.body" fontWeight="semibold">
            Họ và tên
          </Field.Label>
          <Input
            {...fullNameRegistration}
            aria-describedby={errors.fullName ? 'profile-name-error' : undefined}
            autoComplete="name"
            bg="surface.card"
            borderColor="border.default"
            id="profile-name"
            onChange={(event) => {
              setFormError(null)
              setShowSuccess(false)
              if (errors.fullName?.type === 'server') clearErrors('fullName')
              void fullNameRegistration.onChange(event)
            }}
            _invalid={{ borderColor: 'primary.main' }}
          />
          {errors.fullName ? (
            <Field.ErrorText color="primary.main" id="profile-name-error">{errors.fullName.message}</Field.ErrorText>
          ) : null}
        </Field.Root>

        <Field.Root invalid={Boolean(errors.phone)}>
          <Field.Label color="text.body" fontWeight="semibold">
            Số điện thoại <Field.RequiredIndicator fallback="(không bắt buộc)" />
          </Field.Label>
          <Input
            {...phoneRegistration}
            aria-describedby={errors.phone ? 'profile-phone-error' : undefined}
            autoComplete="tel"
            bg="surface.card"
            borderColor="border.default"
            id="profile-phone"
            inputMode="tel"
            onChange={(event) => {
              setFormError(null)
              setShowSuccess(false)
              if (errors.phone?.type === 'server') clearErrors('phone')
              void phoneRegistration.onChange(event)
            }}
            placeholder="090 123 4567"
            type="tel"
            _invalid={{ borderColor: 'primary.main' }}
          />
          {errors.phone ? (
            <Field.ErrorText color="primary.main" id="profile-phone-error">{errors.phone.message}</Field.ErrorText>
          ) : null}
        </Field.Root>

        <HStack gap="3" justify="flex-end" pt="2">
          {isDirty ? (
            <Button
              borderColor="border.default"
              color="text.body"
              disabled={submitting}
              onClick={() => reset(defaultValues)}
              type="button"
              variant="outline"
            >
              Hủy
            </Button>
          ) : null}
          <PrimaryButton disabled={!isDirty || submitting} loading={submitting} loadingText="Đang lưu…" type="submit">
            Lưu thay đổi
          </PrimaryButton>
        </HStack>
      </VStack>
    </form>
  )
}
