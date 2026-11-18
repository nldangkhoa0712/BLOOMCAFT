import { Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { PrimaryButton } from '@/shared/ui/PrimaryButton'

export function NotFoundPage() {
  return (
    <VStack as="section" justify="center" gap="5" minH="calc(100vh - 8rem)" textAlign="center">
      <Text className="text-sm font-bold uppercase tracking-[0.2em] text-primary-main">
        404
      </Text>
      <Heading as="h1" color="text.heading" size="3xl">
        This page has not bloomed yet.
      </Heading>
      <Text color="text.muted">The page you requested could not be found.</Text>
      <PrimaryButton asChild>
        <Link to="/">Return home</Link>
      </PrimaryButton>
    </VStack>
  )
}
