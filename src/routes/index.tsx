import { createFileRoute } from '@tanstack/solid-router'
import { children, createSignal, For, onMount } from 'solid-js'
import { fetchClasses } from '../queries';
import type { Class } from '../types';
import { decodeDate } from '../util';
import { getFavorites, toggleFavorite } from '@/storage';

export const Route = createFileRoute('/')({
  component: App,
  loader: () => fetchClasses()
})

const Star = () => "✰"
const X = () => "✘"

function App() {
  const classes = Route.useLoaderData()

  const [initialFavorites, setInitialFavorites] = createSignal<string[]>([])
  const [favorites, setFavorites] = createSignal<string[]>([])

  const hosts = () => getValues("host")
  const classNames = () => getValues("name")
  const instructors = () => getValues("instructor")

  onMount(() => {
    const favorites = getFavorites()
    setInitialFavorites(favorites)
    setFavorites(favorites)
  })

  const [selectedHosts, setSelectedHosts] = createSignal<string[]>([]);
  const [selectedClasses, setSelectedClasses] = createSignal<string[]>([]);
  const [selectedInstructors, setSelectedInstructors] = createSignal<string[]>([]);

  const filteredClasses = () => classes().map(([day, classes]) => [day, classes.filter(c => {
    if (selectedHosts().length === 0 && selectedClasses().length === 0 && selectedInstructors().length === 0) return true

    return selectedHosts().includes(c.host) ||
      selectedClasses().includes(c.name) ||
      selectedInstructors().includes(c.instructor)
  })] as const)

  const clearFilters = () => {
    setSelectedHosts([])
    setSelectedClasses([])
    setSelectedInstructors([])
  }

  const filterByFavorites = () => {
    clearFilters()

    setSelectedHosts(hosts().filter(h => favorites().includes(h)))
    setSelectedClasses(classNames().filter(n => favorites().includes(n)))
    setSelectedInstructors(instructors().filter(i => favorites().includes(i)))
  }

  return (
    <>
      <aside class="w-full flex flex-col gap-10 pr-10 overflow-y-scroll rounded-t-xl">
        <div class="sticky top-0 flex items-center gap-4">
          <button onClick={filterByFavorites} class="w-full py-3 bg-lagoon-deep/5 rounded-xl backdrop-blur-md">
            <span class="text-shadow-lg text-shadow-lagoon/20"><Star /></span> Filter by Favorites
          </button>
          <button onClick={clearFilters} class="w-full py-3 bg-rose-600/5 rounded-xl backdrop-blur-md">
            <span class="text-rose-600/50 hover:text-rose-500"><X /></span> Clear all Filters
          </button>
        </div>

        <Select
          options={hosts().map(value => ({ value, count: getCount(value, "host") }))}
          selected={selectedHosts()}
          setSelected={setSelectedHosts}
        >
          Locations
        </Select>
        <Select
          options={classNames().map(value => ({ value, count: getCount(value, "name") }))}
          selected={selectedClasses()}
          setSelected={setSelectedClasses}
        >
          Classes
        </Select>
        <Select
          options={instructors().map(value => ({ value, count: getCount(value, "instructor") }))}
          selected={selectedInstructors()}
          setSelected={setSelectedInstructors}
        >
          Instructors
        </Select>
      </aside >

      <main class="grid grid-cols-[repeat(4,max-content)] gap-10 w-full overflow-y-scroll">
        <ul class="contents">
          <For each={filteredClasses()}>{([date, classes]) => <li class="contents">
            <Day date={decodeDate(date)} classes={classes} />
          </li>}
          </For>
        </ul>
      </main>
    </>
  )

  function getValues<K extends keyof Class>(key: K) {
    const values = Array.from(new Set(classes().flatMap(([_, classes]) => classes.map(c => c[key])))).sort()
    return [
      ...values.filter(v => initialFavorites().includes(v.toString())),
      ...values.filter(v => !initialFavorites().includes(v.toString()))
    ]
  }

  function getCount<K extends keyof Class>(value: string, key: K) {
    return classes().reduce((count, [_, classes]) => count + classes.filter((c) => value === c[key]).length, 0)
  }

  function Select(props: {
    options: { value: string, count: number }[],
    selected: string[],
    setSelected: (selected: string[]) => void,
    children: string
  }) {
    const name = children(() => props.children)() as string;
    const id = `select-${name.toLowerCase()}`

    const clearFilters = () => props.setSelected([])
    const filterByFavorites = () => {
      clearFilters()
      props.setSelected(props.options.filter(o => favorites().includes(o.value)).map(o => o.value))
    }

    const StarSection = () => <button onClick={filterByFavorites} class="text-lg text-shadow-lg text-shadow-lagoon/20">
      <Star />
    </button>
    const XSection = () => <button onClick={clearFilters} class="text-rose-600/50 hover:text-rose-500 text-lg">
      <X />
    </button >

    return <div class="w-full grid grid-cols-[1fr_auto_auto] auto-rows-auto gap-x-1">
      <label class="font-bold" for={id}>{name}</label>
      {props.selected.length === 0 ? <StarSection /> : <XSection />}

      <select
        multiple
        size={props.options.length}
        class="w-full mt-4 col-span-full"
        name={name.toLowerCase()}
        id={id}
        onChange={(e) => props.setSelected(Array.from(e.currentTarget.selectedOptions).map((o) => o.value))}
      >
        <For each={props.options}>{({ value, count: c }) => {
          const isFavorited = () => favorites().includes(value)

          return <option
            value={value}
            selected={props.selected.includes(value)}
            class={isFavorited() ? "text-shadow-lg text-shadow-lagoon/20" : "text-gray-400"}
            onContextMenu={(e) => {
              e.preventDefault()
              toggleFavorite(value)
              setFavorites(getFavorites())
            }}
          >{isFavorited() ? <Star /> : ""} {value} ({c})
          </option>
        }}</For>
      </select>
    </div>
  }

  function Day(props: { date: Date, classes: Class[] }) {
    return <div class="col-span-full grid grid-cols-subgrid">
      <h3 class="col-span-full mb-4">
        <span class="font-bold">{props.date.toLocaleDateString("en-US", DATE_OPTIONS)}</span>
        <span class="font-light text-gray-400"> | {props.classes.length} classes</span>
      </h3>
      <ul class="contents">
        <For each={props.classes}>{(c, i) =>
          <li class={`col-span-full grid grid-cols-subgrid ${i() % 2 !== 0 ? "bg-lagoon/5" : ""} pl-1 pr-4 py-0.5`}>
            <ClassItem {...c} />
          </li>
        }</For>
      </ul>
    </div>
  }

  function ClassItem(props: Class) {
    const isFavoriteClass = () => favorites().includes(props.name)
    const isFavoriteInstructor = () => favorites().includes(props.instructor)

    const classStar = <span class={isFavoriteClass() ? "font-normal" : "invisible"}><Star /></span>
    const instructorStar = <span class={isFavoriteInstructor() ? "font-normal" : "invisible"}><Star /></span>
    const startTime = formatTime(props.startTime)
    const endTime = <span class="text-gray-400"> - {formatTime(props.endTime)}</span>

    return <>
      <span class={isFavoriteClass() ? "font-semibold text-shadow-xs text-shadow-lagoon/30" : ""}>
        {classStar} {props.name}
      </span>
      <span>{startTime}{endTime}</span>
      <span class={isFavoriteInstructor() ? "font-semibold text-shadow-xs text-shadow-lagoon/30" : ""}>
        {instructorStar} {props.instructor}
      </span>
      <span class="text-gray-400">{props.host}</span>
    </>
  }
}

// Sun, Jan 1 
const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  weekday: 'short',
  month: 'long',
  year: undefined,
}

// 12:00 PM
const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  second: undefined,
  minute: 'numeric',
  hour: 'numeric',
}

// 12:00pm or 12pm
function formatTime(date: Date) {
  const dateStr = date.toLocaleTimeString("en-US", { ...TIME_OPTIONS, minute: date.getMinutes() === 0 ? undefined : TIME_OPTIONS.minute })

  return dateStr
    .split(" ")
    .join("")
    .toLowerCase()
}
