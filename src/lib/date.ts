export const formatStringToDate = (date: string): Date => {
  const [day, month, year] = date.split('/').map((part) => parseInt(part, 10))
  return new Date(year, month - 1, day)
}
