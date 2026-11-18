import { HStack, NativeSelect } from '@chakra-ui/react'
import type { ChangeEvent } from 'react'

import {
  type ThemePreference,
  useThemePreference,
} from '@/shared/theme/useThemePreference'

const themeLabels: Record<ThemePreference, string> = {
  light: 'Sáng',
  dark: 'Tối',
  system: 'Hệ thống',
}

export function ThemeSwitcher() {
  const { preference, resolvedTheme, setPreference } = useThemePreference()

  const handlePreferenceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPreference(event.currentTarget.value as ThemePreference)
  }

  return (
    <HStack gap="2">
      <label
        className="hidden text-sm font-medium text-text-muted sm:block"
        htmlFor="theme-preference"
      >
        Giao diện
      </label>
      <NativeSelect.Root size="sm" width={{ base: '8.5rem', sm: '10rem' }}>
        <NativeSelect.Field
          id="theme-preference"
          aria-label="Chọn giao diện sáng, tối hoặc theo hệ thống"
          bg="surface.card"
          borderColor="border.default"
          color="text.body"
          onChange={handlePreferenceChange}
          value={preference}
        >
          <option value="system">
            {themeLabels.system} ({themeLabels[resolvedTheme]})
          </option>
          <option value="light">{themeLabels.light}</option>
          <option value="dark">{themeLabels.dark}</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator color="primary.main" />
      </NativeSelect.Root>
    </HStack>
  )
}
