export function info<T>(value: T, print = true) {
  if (print) console.info(value)
  return value
}

export function debug<T>(value: T, print = true) {
  if (print) console.debug(value)
  return value
}

export const simpleISO = (date: Date) => date.toISOString().split("T")[0]

export function encodeDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return year * 10000 + month * 100 + day;
}

export function decodeDate(encoded: number) {
  return new Date(`${Math.floor(encoded / 10000)}-${Math.floor(encoded / 100 % 100)}-${encoded % 100} 00:00:00`)
}
