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

  const filteredClasses = () => classes().map(([day, classes]) => [day, classes.filter(c =>
    (selectedHosts().length === 0 || selectedHosts().includes(c.host)) &&
    (selectedClasses().length === 0 || selectedClasses().includes(c.name)) &&
    (selectedInstructors().length === 0 || selectedInstructors().includes(c.instructor))
  )] as const)

  return (
    <>
      <aside class="w-full flex flex-col gap-10 pr-10 overflow-y-scroll">
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
    const showClear = () => props.selected.length > 0

    return <div class="w-full grid grid-cols-[1fr_auto] auto-rows-auto">
      <label class="font-bold" for={id}>{name}</label>
      <button
        class={`text-rose-600/50 hover:text-rose-500 text-lg ${showClear() ? "cursor-pointer" : "opacity-0"}`}
        onClick={() => props.setSelected([])}
      >
        ✘
      </button>

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
          >{isFavorited() ? "✰" : ""} {value} ({c})
          </option>
        }}</For>
      </select>
    </div>
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

function Day(props: { date: Date, classes: Class[] }) {
  return <div class="col-span-full grid grid-cols-subgrid">
    <h3 class="col-span-full mb-4">
      <span class="font-bold">{props.date.toLocaleDateString("en-US", DATE_OPTIONS)}</span>
      <span class="font-light text-gray-400"> | {props.classes.length} classes</span>
    </h3>
    <ul class="contents">
      <For each={props.classes}>{(c, i) =>
        <li class={`col-span-full grid grid-cols-subgrid ${i() % 2 !== 0 ? "bg-lagoon/5" : ""} px-4 py-0.5`}>
          <ClassItem {...c} />
        </li>
      }</For>
    </ul>
  </div>
}

const ClassItem = (props: Class) => <>
  <span>{props.name}</span>
  <span>{formatTime(props.startTime)}<span class="text-gray-400"> - {formatTime(props.endTime)}</span></span>
  <span>{props.instructor}</span>
  <span class="text-gray-400">{props.host}</span>
</>

// 12:00pm or 12pm
function formatTime(date: Date) {
  const dateStr = date.toLocaleTimeString("en-US", { ...TIME_OPTIONS, minute: date.getMinutes() === 0 ? undefined : TIME_OPTIONS.minute })

  return dateStr
    .split(" ")
    .join("")
    .toLowerCase()
}
