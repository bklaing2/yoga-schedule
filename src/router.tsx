import { createRouter as createTanStackRouter } from '@tanstack/solid-router'
import { routeTree } from './routeTree.gen'

import { QueryClient } from '@tanstack/solid-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/solid-router-ssr-query'

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 60 * 1000,
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,

    context: { queryClient },

    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module '@tanstack/solid-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
