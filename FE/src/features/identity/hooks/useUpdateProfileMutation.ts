import { useMutation, useQueryClient } from '@tanstack/react-query'

import { identityService } from '@/features/identity/api/identityService'
import { identityKeys } from '@/features/identity/hooks/identityKeys'

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: identityService.updateProfile,
    mutationKey: [...identityKeys.all, 'update-profile'],
    onSuccess: (profile) => {
      queryClient.setQueryData(identityKeys.profile(), profile)
    },
  })
}
