import { children } from "solid-js"
import { Star, X } from "@/components/Misc.tsrx"
import { useFavorite, useFilter } from "@/context.tsrx";
import { getFavorites, toggleFavorite } from "@/storage";

export component Sidebar(props: { children: any }) {
  <aside class="flex flex-col gap-10 overflow-y-scroll rounded-t-xl min-w-max">
    {props.children}
  </aside>
}

const toValue = (o: { value: string }) => o.value

export component Section(props: {
  options: { value: string, count: number }[],
  children: string
}) {
  const [filters, filter] = useFilter()
  const [favorites, { set: setFavorites }] = useFavorite()

  const sectionName = children(() => props.children) as () => string
  const sectionId = () => `select-${sectionName().toLowerCase()}`

  const isSelected = ({ value }: { value: string }) => filters().includes(value)
  const isFavorited = ({ value }: { value: string }) => favorites().includes(value)
  const favoriteCount = () => props.options.filter(isFavorited).length

  const clearSectionFilters = () => filter.remove(props.options.map(toValue))
  const filterSectionByFavorites = () => {
    clearSectionFilters()
    filter.add(props.options.filter(isFavorited).map(toValue))
  }

  <div class="w-full grid grid-cols-[1fr_auto_auto] auto-rows-auto gap-x-1 pl-16 pr-8">
    <label class="font-bold" for={sectionId()}>{sectionName()}</label>

    if (props.options.some(isSelected)) {
      <button onClick={clearSectionFilters} class="text-rose-600/50 hover:text-rose-500 text-lg">
        <X />
      </button>
    } else {
      <button
        onClick={filterSectionByFavorites}
        class={`text-lg text-shadow-lg text-shadow-lagoon/20 ${favoriteCount() > 0 ? "" : "invisible"}`}
      >
        <Star />
      </button>
    }

    <select
      multiple
      size={props.options.length}
      class="w-full mt-4 col-span-full"
      name={sectionName().toLowerCase()}
      id={sectionId()}
      onChange={({ currentTarget: { selectedOptions } }) => filter.set([
        ...filters().filter(s => !props.options.some(o => o.value === s)),
        ...Array.from(selectedOptions).map(toValue)
      ])}
    >
      for (const option of props.options) {
        <option
          value={option.value}
          selected={isSelected(option)}
          class={`hover:bg-lagoon/5 rounded-md ${isFavorited(option) ? "text-shadow-lg text-shadow-lagoon/20" : "text-gray-400"}`}
          onContextMenu={(e) => {
            e.preventDefault()
            toggleFavorite(option.value)
            setFavorites(getFavorites())
          }}
        >
          if (isFavorited(option)) <Star />{" "}
          {option.value}" ("{option.count}")"
        </option>
      }
    </select>
  </div>
}
