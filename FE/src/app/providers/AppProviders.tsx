import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

import { bloomCraftSystem } from '@/app/theme/system'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ChakraProvider value={bloomCraftSystem}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableColorScheme
        enableSystem
        storageKey="bloomcraft-theme"
        themes={['light', 'dark']}
      >
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
