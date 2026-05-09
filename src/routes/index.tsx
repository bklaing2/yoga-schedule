import { createFileRoute } from '@tanstack/solid-router'
import { For } from 'solid-js'
import { fetchClasses } from '../queries';
import type { Class } from '../types';
import { decodeDate } from '../util';

export const Route = createFileRoute('/')({ component: App, loader: fetchClasses })

function App() {
  const classes = Route.useLoaderData()

  return (
    <main class="page-wrap px-4 pb-8 pt-14">
      <ul class="grid grid-cols-5 gap-4">
        <For each={Array.from(classes().entries())}>{([date, classes]) => <li class="contents">
          <Day date={decodeDate(date)} classes={classes} />
        </li>}
        </For>
      </ul>
    </main>
  )
}

function Day(props: { date: Date, classes: Class[] }) {
  return <>
    <h3 class="col-span-full">{props.date.toISOString().split("T")[0]}:  {props.classes.length} classes</h3>
    <ul class="contents">
      <For each={props.classes}>{(c) => <li class="contents">
        <ClassItem {...c} />
      </li>}</For>
    </ul>
  </>
}

function ClassItem(props: Class) {
  return <>
    <span>{props.name}</span>
    <span>{props.startTime.toLocaleTimeString("en-US")}</span>
    <span>{props.endTime.toLocaleTimeString("en-US")}</span>
    <span>{props.instructor}</span>
    <span>{props.host}</span>
  </>
}
