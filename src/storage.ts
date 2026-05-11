import { createClientOnlyFn } from "@tanstack/solid-start"

export const getFavorites = createClientOnlyFn(() => {
  const favoriteStr = localStorage.getItem("favorites") || "[]"
  return JSON.parse(favoriteStr) as string[]
})

export const addToFavorites = createClientOnlyFn((value: string) => {
  const favorites = getFavorites()
  if (!favorites.includes(value)) {
    favorites.push(value)
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }
})

export const removeFromFavorites = createClientOnlyFn((value: string) => {
  const favorites = getFavorites()
  const index = favorites.indexOf(value)
  if (index !== -1) {
    favorites.splice(index, 1)
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }
})

export const toggleFavorite = createClientOnlyFn((value: string) => {
  const favorites = getFavorites()
  if (favorites.includes(value)) removeFromFavorites(value)
  else addToFavorites(value)
})
