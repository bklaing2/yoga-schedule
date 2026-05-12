import type { ComponentProps } from "solid-js"
import { Star, X } from "@/components/Misc.tsrx"
import { HOSTS } from "@/constants"
import { useFavorite, useFilter } from "@/context.tsrx"

const HEADER_CLASSES = " min-h-26 sticky top-0 flex items-center gap-4 pt-8 pb-4 backdrop-blur-md " as const
const BUTTON_CLASSES = " h-full flex items-center gap-2 px-8 rounded-xl whitespace-nowrap " as const

// Sidebar
export component SidebarHeader(props: { children: any }) {
  <div class={"pl-16 pr-8" + HEADER_CLASSES}>
    {props.children}
  </div>
}

export component FilterByFavorites(props: ComponentProps<"button">) {
  const [, { set, clear }] = useFilter()
  const [favorites] = useFavorite()

  const onClick = () => {
    clear()
    set(favorites())
  }

  <button {onClick} class={"bg-lagoon-deep/5" + BUTTON_CLASSES} {...props}>
    <span class="text-shadow-lg text-shadow-lagoon/20"><Star /></span>
    " Filter by Favorites"
  </button >
}

export component ClearFilters(props: ComponentProps<"button">) {
  const [, { clear: onClick }] = useFilter()

  <button {onClick} class={"bg-rose-600/5" + BUTTON_CLASSES} {...props}>
    <span class="text-rose-600/50 hover:text-rose-500"><X /></span>
    " Clear all Filters"
  </button>
}

// Main
export component MainHeader(props: { children: any }) {
  <div class={"pl-8 pr-16 col-span-full justify-end" + HEADER_CLASSES}>
    {props.children}
  </div>
}

export component PilatesMethodologyLink(props: ComponentProps<"a">) {
  // font: Gotham Light
  <a
    class={"bg-[rgb(238,239,234)]" + BUTTON_CLASSES}
    href={HOSTS.pilatesMethodology.href}
    {...props}
  >
    "Pilates Methodology"
  </a>
}

export component UptownLink(props: ComponentProps<"a">) {
  // font: Open Sans
  <a
    class={"bg-[rgb(202,159,49)] text-white" + BUTTON_CLASSES}
    href={HOSTS.uptown.href}
    {...props}
  >
    "Uptown Yoga"
  </a>
}

export component V12YogaLink(props: ComponentProps<"a">) {
  // font: Helvetica
  <a
    class={"bg-[rgb(255,0,0)] text-white" + BUTTON_CLASSES}
    href={HOSTS.v12Yoga.href}
    {...props}
  >
    "V12yoga"
  </a>
}

export component YogaZamaLink(props: ComponentProps<"a">) {
  // font: Helvetica
  <a
    class={"bg-[rgb(245,126,33)] text-white" + BUTTON_CLASSES}
    href={HOSTS.yogaZama.href}
    {...props}
  >
    "YogaZama"
  </a>
}
