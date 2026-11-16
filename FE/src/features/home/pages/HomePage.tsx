import { Badge, Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <Box
      as="section"
      className="grid min-h-[calc(100vh-8rem)] place-items-center py-16 sm:py-24"
    >
      <VStack align="start" gap="6" maxW="3xl">
        <Badge colorPalette="green" variant="subtle">
          Frontend foundation ready
        </Badge>

        <VStack align="start" gap="4">
          <Heading as="h1" size={{ base: '4xl', md: '6xl' }} letterSpacing="tight">
            Thoughtful flowers, shaped around every story.
          </Heading>
          <Text color="fg.muted" fontSize={{ base: 'lg', md: 'xl' }} maxW="2xl">
            BloomCraft is preparing a storefront and custom bouquet experience. Product
            features will be connected as their backend contracts become available.
          </Text>
        </VStack>

        <HStack gap="3" flexWrap="wrap">
          <Button asChild colorPalette="green" size="lg">
            <Link to="/">Explore BloomCraft</Link>
          </Button>
          <Text className="text-sm font-medium text-bloom-700">
            React, Chakra UI, and Tailwind CSS
          </Text>
        </HStack>
      </VStack>
    </Box>
  )
}
