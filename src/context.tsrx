import {
  type Accessor,
  createContext,
  createSignal,
  type Setter,
  useContext,
  onMount,
} from "solid-js";
import { getFavorites } from "@/storage";

const FilterContext = createContext<ArrayContextType<string>>()
const FavoriteContext = createContext<ArrayContextType<string>>()

export default component Providers(props: { children: any }) {
  const filter = createArraySignal<string>();
  const favorite = createArraySignal<string>();

  const [mounted, setMounted] = createSignal(false)

  onMount(() => { favorite[1].set(getFavorites()); setMounted(true) })

  if (!mounted()) return

  <FilterContext.Provider value={filter}>
    <FavoriteContext.Provider value={favorite}>
      {props.children}
    </FavoriteContext.Provider>
  </FilterContext.Provider>
}

function createArraySignal<T>() {
  const [array, setArray] = createSignal([] as T[]);

  return [
    array,
    {
      set: setArray,
      add: (values: T[]) => setArray((prev) => [...prev, ...values]),
      remove: (values: T[]) => setArray((prev) => prev.filter((v) => !values.includes(v))),
      clear: () => setArray([]),
      includes: (value: T) => array().includes(value),
      length: () => array().length,
    },
  ] as const;
}

type ArrayContextType<T> = readonly [
  array: Accessor<T[]>,
  actions: {
    readonly set: Setter<T[]>
    readonly add: (values: T[]) => void
    readonly remove: (values: T[]) => void
    readonly clear: () => void
    readonly includes: (value: T) => boolean
    readonly length: () => number
  },
]


export function useFilter() {
  const context = useContext(FilterContext);
  if (!context)
    throw new Error("useFilter must be used within a FilterContext");

  return context
}

export function useFilterValue() {
  const [filters] = useFilter();
  return filters
}

export function useFilterActions() {
  const [, actions] = useFilter();
  return actions
}

export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (!context)
    throw new Error("useFavorite must be used within a FavoriteContext");

  return context
}

export function useFavoriteValue() {
  const [favorite] = useFavorite();
  return favorite
}

export function useFavoriteActions() {
  const [, actions] = useFavorite();
  return actions
}
