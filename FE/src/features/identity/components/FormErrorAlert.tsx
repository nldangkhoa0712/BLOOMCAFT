import { Box, Text } from '@chakra-ui/react'

export function FormErrorAlert({ message }: { message: string }) {
  return (
    <Box
      aria-live="polite"
      bg="background.secondary"
      borderColor="primary.main"
      borderRadius="lg"
      borderWidth="1px"
      color="text.body"
      p="3"
      role="alert"
    >
      <Text fontSize="sm">{message}</Text>
    </Box>
  )
}
