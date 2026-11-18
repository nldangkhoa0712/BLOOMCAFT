import { Box, Container, Flex, HStack, Text } from '@chakra-ui/react'
import { Link, Outlet } from 'react-router-dom'

import { ThemeSwitcher } from '@/shared/theme/ThemeSwitcher'

export function AppLayout() {
  return (
    <Flex bg="background.main" color="text.body" minH="100vh" direction="column">
      <Box
        as="header"
        bg="background.secondary"
        borderBottomWidth="1px"
        borderColor="border.default"
      >
        <Container maxW="7xl" py="4">
          <Flex align="center" justify="space-between">
            <Link
              aria-label="BloomCraft home"
              className="font-heading text-xl font-semibold tracking-tight text-primary-main no-underline"
              to="/"
            >
              BloomCraft
            </Link>
            <HStack gap={{ base: '3', md: '6' }}>
              <Text
                color="text.muted"
                display={{ base: 'none', md: 'block' }}
                fontSize="sm"
              >
                Flowers, made personal
              </Text>
              <ThemeSwitcher />
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Box as="main" flex="1">
        <Container maxW="7xl">
          <Outlet />
        </Container>
      </Box>

      <Box
        as="footer"
        bg="background.secondary"
        borderTopWidth="1px"
        borderColor="border.default"
      >
        <Container maxW="7xl" py="4">
          <Text color="text.muted" fontSize="sm">
            BloomCraft
          </Text>
        </Container>
      </Box>
    </Flex>
  )
}
