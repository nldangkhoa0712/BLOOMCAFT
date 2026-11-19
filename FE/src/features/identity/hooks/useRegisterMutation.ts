import { useMutation } from '@tanstack/react-query'

import { identityService } from '@/features/identity/api/identityService'
import { identityKeys } from '@/features/identity/hooks/identityKeys'

export function useRegisterMutation() {
  return useMutation({
    mutationFn: identityService.register,
    mutationKey: [...identityKeys.all, 'register'],
  })
}
