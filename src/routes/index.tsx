import { createFileRoute } from "@tanstack/solid-router"
import {
  ClearFilters,
  FilterByFavorites,
  MainHeader,
  PilatesMethodologyLink,
  SidebarHeader,
  UptownLink,
  V12YogaLink,
  YogaZamaLink,
} from "@/components/Header.tsrx";
import { Main, Schedule } from "@/components/Main.tsrx";
import { Section, Sidebar } from "@/components/Sidebar.tsrx";
import { fetchClasses } from "@/queries";
import type { Class } from "@/types";
import { useFavoriteValue } from "@/context.tsrx";

export const Route = createFileRoute("/")({
  component: Home,
  loader: () => fetchClasses()
})

function Home() {
  const classes = Route.useLoaderData()()

  const favorites = useFavoriteValue()()

  const studios = collectOptions("studio")
  const classNames = collectOptions("name")
  const instructors = collectOptions("instructor")

  function collectOptions<K extends keyof Class>(key: K) {
    const values = Array.from(new Set(classes.flatMap(([_, classes]) => classes.map(c => c[key] as string)))).sort()
    return [
      ...values.filter(v => favorites.includes(v.toString())),
      ...values.filter(v => !favorites.includes(v.toString()))
    ].map(value => ({
      value,
      count: classes
        .reduce((count, [_, classes]) => count + classes.filter((c) => value === c[key]).length, 0),
    }))
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <FilterByFavorites />
          <ClearFilters />
        </SidebarHeader>

        <Section options={studios}>Studios</Section>
        <Section options={classNames}>Classes</Section>
        <Section options={instructors}>Instructors</Section>
      </Sidebar>

      <Main>
        <MainHeader>
          <PilatesMethodologyLink />
          <UptownLink />
          <V12YogaLink />
          <YogaZamaLink />
        </MainHeader>

        <Schedule classes={classes} />
      </Main>
    </>
  )
}
