import { Box, Center, Heading, Spinner, Text, VStack } from '@chakra-ui/react'

import { ProfileForm } from '@/features/identity/components/ProfileForm'
import { useProfileQuery } from '@/features/identity/hooks/useProfileQuery'
import { useUpdateProfileMutation } from '@/features/identity/hooks/useUpdateProfileMutation'
import type { ProfileFormValues } from '@/features/identity/schemas/identitySchemas'

export function ProfilePage() {
  const profileQuery = useProfileQuery()
  const updateProfileMutation = useUpdateProfileMutation()

  if (profileQuery.isPending) {
    return (
      <Center minH="50vh">
        <Spinner color="primary.main" size="lg" />
      </Center>
    )
  }

  if (profileQuery.isError) {
    return (
      <Center minH="50vh">
        <Text color="text.muted">Chưa thể tải thông tin tài khoản.</Text>
      </Center>
    )
  }

  const profile = profileQuery.data
  const handleUpdateProfile = async (values: ProfileFormValues) => {
    await updateProfileMutation.mutateAsync(values)
  }

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
            avatarUrl={profile.avatarUrl}
            defaultValues={{ fullName: profile.fullName, phone: profile.phone ?? '' }}
            email={profile.email}
            onSubmit={handleUpdateProfile}
          />
        </Box>
      </VStack>
    </Box>
  )
}
