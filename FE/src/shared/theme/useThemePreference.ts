import { useTheme } from 'next-themes'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const isThemePreference = (value: string | undefined): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system'

export function useThemePreference() {
  const { resolvedTheme, setTheme, theme } = useTheme()

  return {
    preference: isThemePreference(theme) ? theme : 'system',
    resolvedTheme: resolvedTheme === 'dark' ? 'dark' : 'light',
    setPreference: (preference: ThemePreference) => setTheme(preference),
  } as const
}
