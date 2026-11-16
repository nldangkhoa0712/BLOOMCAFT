import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

const system = createSystem(defaultConfig, {
  preflight: false,
})

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
