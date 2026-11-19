export const identityKeys = {
  all: ['identity'] as const,
  profile: () => [...identityKeys.all, 'profile'] as const,
}
