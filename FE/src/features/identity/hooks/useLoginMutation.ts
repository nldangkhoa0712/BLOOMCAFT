import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAppDispatch } from '@/app/store/hooks'
import { identityService } from '@/features/identity/api/identityService'
import { identityKeys } from '@/features/identity/hooks/identityKeys'
import { sessionAuthenticated } from '@/features/identity/store/authSlice'

export function useLoginMutation() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: identityService.login,
    mutationKey: [...identityKeys.all, 'login'],
    onSuccess: (result) => {
      queryClient.setQueryData(identityKeys.profile(), result.profile)
      dispatch(sessionAuthenticated(result.accessToken))
    },
  })
}
