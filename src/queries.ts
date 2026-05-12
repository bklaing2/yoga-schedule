import { JSDOM } from "jsdom"
import { createServerFn } from "@tanstack/solid-start"
import { HOSTS, MINUTE, SECOND } from "@/constants"
import type { Class, PilatesMethodologyResponse, UptownResponse, V12YogaResponse, YogaZamaResponse } from "@/types"
import { encodeDate, info } from "@/util"

export const fetchClasses = createServerFn().handler(async () => {
  const allClasses = await Promise.all([
    fetchPilatesMethodology(),
    fetchUptown(),
    fetchV12Yoga(),
    fetchYogaZama(),
  ])

  const classes = new Map<number, Class[]>()
  for (const classMap of allClasses) {
    if (!classMap) continue

    for (const [date, classList] of classMap.entries())
      classes.set(date, [...(classes.get(date) ?? []), ...classList])
  }

  for (const [date, classList] of classes.entries()) {
    classes.set(date, classList
      // Sort classes by start time
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      // Clean/normalize fields
      .map(c => ({
        ...c,
        name: c.name.trim(),
        instructor: c.instructor.trim(),
      }))
    )
  }

  return info(Array.from(classes.entries()), false)
})

async function fetchPilatesMethodology() {
  const res = await fetch(HOSTS.pilatesMethodology.url)
  const { payload: classes } = (await res.json()) as PilatesMethodologyResponse
  return info(classes.filter((c) =>
    !c.isCancelled
  ).reduce((days, c) => {
    const startTime = new Date(c.startsAt)
    const key = encodeDate(startTime)
    const day = days.get(key) ?? []
    days.set(key, [...day, {
      name: c.sessionName,
      instructor: c.teacher,
      startTime,
      endTime: new Date(c.endsAt),
      host: "Pilates Methodology",
      // _raw: c,
    }])
    return days
  }, new Map<number, Class[]>()))
}

async function fetchUptown() {
  const res = await fetch(HOSTS.uptown.url)
  const { data } = (await res.json()) as UptownResponse, { classes } = data
  return classes.filter((c) =>
    c.location.name.toLowerCase().includes("uptown") &&
    c.isBookable &&
    !c.canceled &&
    !c.hidden
  ).reduce((days, c) => {
    const startTime = new Date(c.start_time * SECOND)
    const key = encodeDate(startTime)
    const day = days.get(key) ?? []
    days.set(key, [...day, {
      name: c.name,
      instructor: c.host_name,
      startTime,
      endTime: new Date(c.end_time * SECOND),
      host: "Uptown Yoga",
      // _raw: c,
    }])
    return days
  }, new Map<number, Class[]>())
}

async function fetchV12Yoga() {
  const res = await fetch(HOSTS.v12Yoga.url)
  const { contents } = (await res.json()) as V12YogaResponse
  const { window: { document } } = new JSDOM(contents)
  const rows = document.getElementsByTagName("tr")

  const classes: Class[] = []

  let date = new Date()
  for (const row of rows) {
    if (row.classList.contains("schedule_header")) {
      date = new Date(row.getElementsByClassName("hc_date")[0].textContent)
      continue
    }

    const startTimeRaw = row.getElementsByClassName("hc_starttime")[0].getAttribute("data-datetime")!
    const endTimeRaw = row.getElementsByClassName("hc_endtime")[0].getAttribute("data-datetime")!

    classes.push({
      name: row.getElementsByClassName("classname")[0].textContent,
      instructor: row.getElementsByClassName("trainer")[1].textContent,
      startTime: new Date(startTimeRaw.substring(1, startTimeRaw.length - 7)),
      endTime: new Date(endTimeRaw.substring(1, endTimeRaw.length - 7)),
      host: "V12yoga",
      // _raw: document
    })
  }

  return info(classes.reduce((days, c) => {
    const key = encodeDate(c.startTime)
    const day = days.get(key) ?? []
    days.set(key, [...day, c])
    return days
  }, new Map<number, Class[]>()))
}

async function fetchYogaZama() {
  const res = await fetch(HOSTS.yogaZama.url)
  const { results: classes } = (await res.json()) as YogaZamaResponse
  return info(classes.filter((c) =>
    !c.is_cancelled
  ).reduce((days, c) => {
    const startTime = new Date(`${c.start_date} ${c.start_time}`)
    const key = encodeDate(startTime)
    const day = days.get(key) ?? []
    days.set(key, [...day, {
      name: c.name,
      instructor: c.instructors[0]?.name || "Unknown",
      startTime,
      endTime: new Date(startTime.getTime() + c.class_type.duration * MINUTE),
      host: "YogaZama",
      // _raw: c,
    }])
    return days
  }, new Map<number, Class[]>()))
}
