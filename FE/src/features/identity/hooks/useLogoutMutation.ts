import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAppDispatch } from '@/app/store/hooks'
import { identityService } from '@/features/identity/api/identityService'
import { identityKeys } from '@/features/identity/hooks/identityKeys'
import { sessionCleared } from '@/features/identity/store/authSlice'

export function useLogoutMutation() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: identityService.logout,
    mutationKey: [...identityKeys.all, 'logout'],
    onSettled: async () => {
      dispatch(sessionCleared())
      await queryClient.cancelQueries({ queryKey: identityKeys.all })
      queryClient.removeQueries({ queryKey: identityKeys.all })
    },
  })
}
