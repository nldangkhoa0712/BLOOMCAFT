import { Center, Heading, Text, VStack } from '@chakra-ui/react'

import { PrimaryButton } from '@/shared/ui/PrimaryButton'

export function SessionErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <Center bg="background.main" color="text.body" minH="100vh" px="6">
      <VStack gap="5" maxW="lg" textAlign="center">
        <Text className="font-heading text-2xl font-semibold text-primary-main">
          BloomCraft
        </Text>
        <Heading as="h1" color="text.heading" size="2xl">
          Chưa thể kết nối tới máy chủ
        </Heading>
        <Text color="text.muted">
          Vui lòng kiểm tra kết nối mạng hoặc thử lại sau ít phút.
        </Text>
        <PrimaryButton onClick={onRetry}>Thử lại</PrimaryButton>
      </VStack>
    </Center>
  )
}
