import { Box, Heading, Text, VStack } from '@chakra-ui/react'

import { ProfileForm } from '@/features/identity/components/ProfileForm'

const previewProfile = {
  avatarUrl: null,
  email: 'bloom@example.com',
  fullName: 'Bloom Customer',
  phone: '',
}

export function ProfilePage() {
  return (
    <Box as="section" py={{ base: '10', md: '16' }}>
      <VStack align="stretch" gap="8" margin="0 auto" maxW="3xl">
        <VStack align="start" gap="3">
          <Text color="primary.main" fontSize="sm" fontWeight="semibold" letterSpacing="0.12em" textTransform="uppercase">
            Tài khoản BloomCraft
          </Text>
          <Heading as="h1" color="text.heading" fontSize={{ base: '3xl', md: '4xl' }}>
            Thông tin tài khoản
          </Heading>
          <Text color="text.muted" maxW="2xl">
            Cập nhật thông tin để BloomCraft có thể chăm chút trải nghiệm dành riêng cho bạn.
          </Text>
        </VStack>

        <Box
          bg="surface.card"
          borderColor="border.default"
          borderRadius={{ base: '2xl', md: '3xl' }}
          borderWidth="1px"
          p={{ base: '6', md: '10' }}
        >
          <ProfileForm
            avatarUrl={previewProfile.avatarUrl}
            defaultValues={{ fullName: previewProfile.fullName, phone: previewProfile.phone }}
            email={previewProfile.email}
          />
        </Box>
      </VStack>
    </Box>
  )
}
