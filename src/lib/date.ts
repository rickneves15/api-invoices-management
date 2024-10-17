import { MONTHS_ORDER } from '~/common/constants/date'

export const formatStringToDate = (date: string): Date => {
  const [day, month, year] = date.split('/').map((part) => parseInt(part, 10))
  return new Date(year, month - 1, day)
}

export const sortByMonth = (
  a: { referenceMonth: string },
  b: { referenceMonth: string },
) => {
  const [monthA, yearA] = a.referenceMonth.split('/')
  const [monthB, yearB] = b.referenceMonth.split('/')

  const yearDiff = parseInt(yearA) - parseInt(yearB)
  if (yearDiff !== 0) {
    return yearDiff
  }

  return MONTHS_ORDER.indexOf(monthA) - MONTHS_ORDER.indexOf(monthB)
}
