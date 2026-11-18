import { Badge, Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { PrimaryButton } from '@/shared/ui/PrimaryButton'

export function HomePage() {
  return (
    <Box
      as="section"
      className="grid min-h-[calc(100vh-8rem)] place-items-center py-16 sm:py-24"
    >
      <Box
        bg="surface.card"
        borderColor="border.default"
        borderRadius={{ base: '2xl', md: '3xl' }}
        borderWidth="1px"
        maxW="3xl"
        p={{ base: '7', md: '12' }}
      >
        <VStack align="start" gap="6">
          <Badge
            bg="accent.sage"
            borderColor="border.default"
            borderWidth="1px"
            color="accent.onSage"
            variant="solid"
          >
            Frontend foundation ready
          </Badge>

          <VStack align="start" gap="4">
            <Heading
              as="h1"
              color="text.heading"
              size={{ base: '4xl', md: '6xl' }}
              letterSpacing="tight"
            >
              Thoughtful flowers, shaped around every story.
            </Heading>
            <Text color="text.muted" fontSize={{ base: 'lg', md: 'xl' }} maxW="2xl">
              BloomCraft is preparing a storefront and custom bouquet experience. Product
              features will be connected as their backend contracts become available.
            </Text>
          </VStack>

          <HStack gap="3" flexWrap="wrap">
            <PrimaryButton asChild size="lg">
              <Link to="/">Explore BloomCraft</Link>
            </PrimaryButton>
            <Text className="text-sm font-medium text-primary-main">
              React, Chakra UI, and Tailwind CSS
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}
