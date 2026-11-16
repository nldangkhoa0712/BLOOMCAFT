import { Box, Container, Flex, Text } from '@chakra-ui/react'
import { Link, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <Flex minH="100vh" direction="column">
      <Box as="header" borderBottomWidth="1px" borderColor="blackAlpha.100" bg="whiteAlpha.800">
        <Container maxW="7xl" py="4">
          <Flex align="center" justify="space-between">
            <Link
              aria-label="BloomCraft home"
              className="text-xl font-bold tracking-tight text-leaf-600 no-underline"
              to="/"
            >
              BloomCraft
            </Link>
            <Text color="fg.muted" fontSize="sm">
              Flowers, made personal
            </Text>
          </Flex>
        </Container>
      </Box>

      <Box as="main" flex="1">
        <Container maxW="7xl">
          <Outlet />
        </Container>
      </Box>

      <Box as="footer" borderTopWidth="1px" borderColor="blackAlpha.100">
        <Container maxW="7xl" py="4">
          <Text color="fg.muted" fontSize="sm">
            BloomCraft
          </Text>
        </Container>
      </Box>
    </Flex>
  )
}
