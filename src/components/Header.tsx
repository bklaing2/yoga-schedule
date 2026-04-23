import { Link } from '@tanstack/solid-router'

export default function Header() {
  return (
    <header class="site-header px-4">
      <nav class="page-wrap nav-shell">
        <h2 class="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link to="/" class="brand-pill">
            <span class="brand-dot" />
            Yoga Schedule
          </Link>
        </h2>
      </nav>
    </header>
  )
}
