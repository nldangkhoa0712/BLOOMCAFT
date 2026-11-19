import { HStack, Text, VStack } from '@chakra-ui/react'

import { passwordRules } from '@/features/identity/schemas/identitySchemas'

function CheckIcon({ isMet }: { isMet: boolean }) {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <circle cx="8" cy="8" fill="currentColor" opacity="0.16" r="7" />
      {isMet ? (
        <path d="m4.5 8 2.1 2.1 4.9-4.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      ) : (
        <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.55" />
      )}
    </svg>
  )
}

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <VStack align="start" aria-label="Các yêu cầu của mật khẩu" gap="2" role="list">
      {passwordRules.map((rule) => {
        const isMet = rule.test(password)

        return (
          <HStack key={rule.label} color={isMet ? 'accent.sage' : 'text.muted'} gap="2" role="listitem">
            <CheckIcon isMet={isMet} />
            <Text color={isMet ? 'text.body' : 'text.muted'} fontSize="sm">
              {rule.label}
            </Text>
          </HStack>
        )
      })}
    </VStack>
  )
}
