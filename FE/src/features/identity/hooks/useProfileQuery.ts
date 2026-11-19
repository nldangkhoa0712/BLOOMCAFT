import { useQuery } from '@tanstack/react-query'

import { profileQueryOptions } from '@/features/identity/hooks/profileQuery'

export function useProfileQuery() {
  return useQuery(profileQueryOptions())
}
