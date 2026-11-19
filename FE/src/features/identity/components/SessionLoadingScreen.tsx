import { Center, Spinner, Text, VStack } from '@chakra-ui/react'

export function SessionLoadingScreen() {
  return (
    <Center bg="background.main" color="text.body" minH="100vh">
      <VStack gap="4">
        <Text className="font-heading text-3xl font-semibold text-primary-main">
          BloomCraft
        </Text>
        <Spinner color="primary.main" size="lg" />
        <Text aria-live="polite" color="text.muted" fontSize="sm">
          Đang chuẩn bị trải nghiệm của bạn…
        </Text>
      </VStack>
    </Center>
  )
}
