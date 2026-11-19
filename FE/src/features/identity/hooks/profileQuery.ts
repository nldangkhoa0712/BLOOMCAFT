import { queryOptions } from '@tanstack/react-query'

import { identityService } from '@/features/identity/api/identityService'
import { identityKeys } from '@/features/identity/hooks/identityKeys'

export const profileQueryOptions = () =>
  queryOptions({
    queryFn: () => identityService.getProfile(),
    queryKey: identityKeys.profile(),
  })
