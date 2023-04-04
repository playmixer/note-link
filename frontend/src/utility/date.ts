export const stringToDate = (s: string) => {
  const split = s.split("-")

  return new Date(`${split[1]}/${split[2]}/${split[0]}`)
}
