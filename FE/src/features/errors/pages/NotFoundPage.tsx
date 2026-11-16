import { Button, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <VStack as="section" justify="center" gap="5" minH="calc(100vh - 8rem)" textAlign="center">
      <Text className="text-sm font-bold uppercase tracking-[0.2em] text-bloom-700">
        404
      </Text>
      <Heading as="h1" size="3xl">
        This page has not bloomed yet.
      </Heading>
      <Text color="fg.muted">The page you requested could not be found.</Text>
      <Button asChild colorPalette="green">
        <Link to="/">Return home</Link>
      </Button>
    </VStack>
  )
}
