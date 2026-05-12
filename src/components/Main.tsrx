import { Star } from "@/components/Misc.tsrx";
import { useFavoriteValue, useFilterActions, useFilterValue } from "@/context.tsrx";
import type { Class } from "@/types";
import { decodeDate, } from "@/util";

export component Main(props: { children: any }) {
  <main class="grid grid-cols-[repeat(3,max-content)_1fr] gap-10 w-full overflow-y-scroll">
    {props.children}
  </main>
}

export component Schedule(props: { classes: (readonly[number, Class[]])[] }) {
  const filters = useFilterValue()

  const filteredClasses = () => props.classes.map(([day, classes]) => [day, classes.filter(c =>
    filters().length === 0 || filters().some(s => [c.host, c.name, c.instructor].includes(s))
  )] as const)

  <ul class="contents">
    for (const [encodedDate, classes] of filteredClasses()) {
      const date = decodeDate(encodedDate)
      <Day {date} {classes}>
        for (const c of classes; index i) {
          <ClassItem {...c} stripe={i() % 2 !== 0} />
        }
      </Day>
    }
  </ul>
}

// Sun, Jan 1 
const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  weekday: "short",
  month: "long",
  year: undefined,
}

// 12:00 PM
const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  second: undefined,
  minute: "numeric",
  hour: "numeric",
}

// 12:00pm or 12pm
function formatTime(date: Date) {
  const dateStr = date.toLocaleTimeString("en-US", { ...TIME_OPTIONS, minute: date.getMinutes() === 0 ? undefined : TIME_OPTIONS.minute })

  return dateStr
    .split(" ")
    .join("")
    .toLowerCase()
}

component Day(props: { date: Date, classes: Class[], children: any }) {
  <li class="col-span-full grid grid-cols-subgrid pr-16 pl-8">
    <h3 class="col-span-full mb-4">
      <span class="font-bold">{props.date.toLocaleDateString("en-US", DATE_OPTIONS)}</span>
      <span class="font-light text-gray-400">" | "{props.classes.length}" classes"</span>
    </h3>

    <ul class="contents">
      {props.children}
    </ul>
  </li>
}

component ClassItem(props: Class & { stripe: boolean }) {
  const { set: setFilters } = useFilterActions()
  const favorites = useFavoriteValue()

  const isFavoriteClass = () => favorites().includes(props.name)
  const isFavoriteInstructor = () => favorites().includes(props.instructor)

  <li class={"col-span-full grid grid-cols-subgrid pl-1 pr-4 py-0.5 " + (props.stripe ? "bg-lagoon/5" : "")}>
    <button onClick={() => setFilters([props.name])} class={"text-left " + (isFavoriteClass() ? "font-semibold text-shadow-xs text-shadow-lagoon/30" : "")}>
      <span class={isFavoriteClass() ? "font-normal" : "invisible"}><Star /></span>
      " "{props.name}
    </button>
    <span>
      {formatTime(props.startTime)}
      <span class="text-gray-400">" - "{formatTime(props.endTime)}</span>
    </span>
    <button onClick={() => setFilters([props.instructor])} class={"text-left " + (isFavoriteInstructor() ? "font-semibold text-shadow-xs text-shadow-lagoon/30" : "")}>
      <span class={isFavoriteInstructor() ? "font-normal" : "invisible"}><Star /></span>
      " "{props.instructor}
    </button>
    <button onClick={() => setFilters([props.host])} class="text-left text-gray-400">{props.host}</button>
  </li>
}
