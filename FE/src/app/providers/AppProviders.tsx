import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-redux'
import type { PropsWithChildren } from 'react'

import { queryClient } from '@/app/query/queryClient'
import { store } from '@/app/store/store'
import { bloomCraftSystem } from '@/app/theme/system'
import { AuthBootstrap } from '@/features/identity/components/AuthBootstrap'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
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
            <AuthBootstrap>{children}</AuthBootstrap>
          </ThemeProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  )
}
