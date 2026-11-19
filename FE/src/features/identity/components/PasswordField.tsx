import { Box, Field, IconButton, Input } from '@chakra-ui/react'
import { useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface PasswordFieldProps {
  autoComplete: string
  error?: string
  id: string
  label: string
  onFocus?: () => void
  placeholder?: string
  registration: UseFormRegisterReturn
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.8" />
      {hidden ? (
        <path d="m4 4 16 16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      ) : null}
    </svg>
  )
}

export function PasswordField({
  autoComplete,
  error,
  id,
  label,
  onFocus,
  placeholder,
  registration,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const errorId = error ? `${id}-error` : undefined

  return (
    <Field.Root invalid={Boolean(error)}>
      <Field.Label color="text.body" fontWeight="semibold">
        {label}
      </Field.Label>
      <Box position="relative" width="full">
        <Input
          {...registration}
          aria-describedby={errorId}
          autoComplete={autoComplete}
          bg="surface.card"
          borderColor="border.default"
          id={id}
          onFocus={onFocus}
          pe="12"
          placeholder={placeholder}
          type={isVisible ? 'text' : 'password'}
          _invalid={{ borderColor: 'primary.main' }}
        />
        <IconButton
          aria-label={isVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          color="text.muted"
          minW="9"
          onClick={() => setIsVisible((visible) => !visible)}
          position="absolute"
          right="1"
          size="sm"
          top="50%"
          transform="translateY(-50%)"
          type="button"
          variant="ghost"
        >
          <EyeIcon hidden={isVisible} />
        </IconButton>
      </Box>
      {error ? (
        <Field.ErrorText color="primary.main" id={errorId}>{error}</Field.ErrorText>
      ) : null}
    </Field.Root>
  )
}
