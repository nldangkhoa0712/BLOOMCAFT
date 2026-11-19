import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import type { PropsWithChildren, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { ThemeSwitcher } from '@/shared/theme/ThemeSwitcher'

interface AuthLayoutProps extends PropsWithChildren {
  description: string
  eyebrow: string
  title: string
  footer: ReactNode
}

function BotanicalArtwork() {
  return (
    <Box aria-hidden="true" inset="0" overflow="hidden" position="absolute">
      <Box
        bg="accent.lavender"
        borderRadius="full"
        height={{ base: '16rem', xl: '22rem' }}
        opacity="0.55"
        position="absolute"
        right={{ base: '-7rem', xl: '-8rem' }}
        top={{ base: '-5rem', xl: '-7rem' }}
        width={{ base: '16rem', xl: '22rem' }}
      />
      <Box
        bg="accent.peach"
        borderRadius="full"
        bottom={{ base: '-8rem', xl: '-10rem' }}
        height={{ base: '20rem', xl: '27rem' }}
        left={{ base: '-8rem', xl: '-10rem' }}
        opacity="0.65"
        position="absolute"
        width={{ base: '20rem', xl: '27rem' }}
      />
      <svg
        className="absolute bottom-[7%] right-[4%] h-[48%] w-[58%] text-primary-main opacity-60"
        fill="none"
        viewBox="0 0 420 420"
      >
        <path
          d="M82 390c58-74 112-145 160-254M238 144c33 36 58 77 74 126M208 214c-45-12-82-38-109-76"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          d="M247 130c-8-45 12-84 55-111 12 50-6 90-55 111ZM298 252c26-39 65-55 114-47-29 43-68 59-114 47ZM204 217c-47 5-86-12-116-52 51-8 91 9 116 52Z"
          fill="currentColor"
          opacity="0.2"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path
          d="M231 130c-38-8-64-32-78-72 44 7 71 31 78 72ZM314 283c42 4 73 26 91 66-47-2-79-24-91-66Z"
          fill="currentColor"
          opacity="0.14"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </svg>
    </Box>
  )
}

export function AuthLayout({ children, description, eyebrow, footer, title }: AuthLayoutProps) {
  return (
    <Box bg="background.main" color="text.body" minH="100vh">
      <Box position="absolute" right={{ base: '4', md: '6' }} top={{ base: '4', md: '6' }} zIndex="2">
        <ThemeSwitcher />
      </Box>

      <Box className="grid min-h-screen lg:grid-cols-[45%_55%]">
        <Flex
          align="center"
          bg="background.secondary"
          display={{ base: 'none', lg: 'flex' }}
          overflow="hidden"
          p={{ lg: '12', xl: '16' }}
          position="relative"
        >
          <BotanicalArtwork />
          <VStack align="start" gap="6" maxW="lg" position="relative" zIndex="1">
            <Link
              aria-label="Về trang chủ BloomCraft"
              className="font-heading text-2xl font-semibold tracking-tight text-primary-main no-underline"
              to="/"
            >
              BloomCraft
            </Link>
            <Text color="primary.main" fontSize="sm" fontWeight="semibold" letterSpacing="0.16em" textTransform="uppercase">
              Hoa kể câu chuyện của riêng bạn
            </Text>
            <Heading as="h2" color="text.heading" fontSize={{ lg: '4xl', xl: '5xl' }} lineHeight="1.15">
              Mỗi lựa chọn nhỏ đều có thể nở thành một kỷ niệm đẹp.
            </Heading>
            <Text color="text.muted" fontSize={{ lg: 'lg', xl: 'xl' }} lineHeight="1.8" maxW="md">
              Đồng hành cùng BloomCraft để lưu lại những bó hoa, câu chuyện và khoảnh khắc dành riêng cho bạn.
            </Text>
          </VStack>
        </Flex>

        <Flex align="center" justify="center" px={{ base: '4', sm: '6', lg: '10' }} py={{ base: '24', lg: '16' }}>
          <Box maxW="30rem" width="full">
            <VStack align="stretch" gap="7">
              <VStack align="start" display={{ base: 'flex', lg: 'none' }} gap="2" pr="36">
                <Link
                  aria-label="Về trang chủ BloomCraft"
                  className="font-heading text-2xl font-semibold tracking-tight text-primary-main no-underline"
                  to="/"
                >
                  BloomCraft
                </Link>
                <Text color="text.muted" fontSize="sm">
                  Hoa kể câu chuyện của riêng bạn.
                </Text>
              </VStack>

              <Box
                bg="surface.card"
                borderColor="border.default"
                borderRadius={{ base: '2xl', md: '3xl' }}
                borderWidth="1px"
                p={{ base: '6', sm: '8', md: '10' }}
              >
                <VStack align="stretch" gap="7">
                  <VStack align="start" gap="3">
                    <Text color="primary.main" fontSize="sm" fontWeight="semibold" letterSpacing="0.12em" textTransform="uppercase">
                      {eyebrow}
                    </Text>
                    <Heading as="h1" color="text.heading" fontSize={{ base: '3xl', sm: '4xl' }} lineHeight="1.15">
                      {title}
                    </Heading>
                    <Text color="text.muted" lineHeight="1.7">
                      {description}
                    </Text>
                  </VStack>

                  {children}

                  <Box borderColor="border.default" borderTopWidth="1px" pt="5">
                    {footer}
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
