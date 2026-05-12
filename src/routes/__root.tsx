import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/solid-router"
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools"
import { HydrationScript } from "solid-js/web"
import { Suspense } from "solid-js"
import Providers from "@/context.tsrx"
import styleCss from "@/styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: "stylesheet", href: styleCss }],
  }),
  shellComponent: RootComponent,
})

function RootComponent() {
  return (
    <html>
      <head>
        <HydrationScript />
      </head>
      <body class="h-screen flex justify-start">
        <HeadContent />
        <Suspense>
          <Providers>
            <Outlet />
          </Providers>
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>
        <Scripts />
      </body>
    </html>
  )
}
