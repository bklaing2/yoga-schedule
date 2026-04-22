import { simpleISO } from "./util"

export const MILLISECOND = 1
export const SECOND = 1000 * MILLISECOND
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

const TODAY = new Date(new Date().toDateString())
const NEXT_WEEK = new Date(TODAY.getTime() + 7 * DAY)

export const HOSTS = {
  uptown: {
    url: import.meta.env.VITE_UPTOWN_URL
      .replace("{FROM}", TODAY.valueOf() / SECOND)
  },
  yogaZama: {
    url: import.meta.env.VITE_YOGAZAMA_URL
      .replace("{FROM}", simpleISO(TODAY))
      .replace("{TO}", simpleISO(NEXT_WEEK))
  },
  v12Yoga: {
    url: import.meta.env.VITE_V12YOGA_URL
  },
  pilatesMethodology: {
    url: import.meta.env.VITE_PILATESMETHODOLOGY_URL
      .replace("{FROM}", simpleISO(TODAY))
      .replace("{TO}", simpleISO(NEXT_WEEK))
  },
}
