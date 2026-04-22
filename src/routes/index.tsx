import { createFileRoute } from '@tanstack/solid-router'
import { For, Match, Switch } from 'solid-js'
import { createClasses } from '../queries';
import type { Class } from '../types';
import { decodeDate } from '../util';

export const Route = createFileRoute('/')({ component: App })

function App() {
  const classes = createClasses()

  return (
    <main class="page-wrap px-4 pb-8 pt-14">
      <Switch fallback={<p>Loading...</p>}>
        <Match when={classes.error}>
          <p>Error loading classes: {classes.error?.message || "unknown"}</p>
        </Match>
        <Match when={classes.isFetching}>
          <p>Loading classes...</p>
        </Match>
        <Match when={classes.data}>
          <ul class="grid grid-cols-5 gap-4">
            <For each={Array.from(classes.data!.entries())}>{([date, classes]) => <li class="contents">
              <Day date={decodeDate(date)} classes={classes} />
            </li>}
            </For>
          </ul>
        </Match>
      </Switch>
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
