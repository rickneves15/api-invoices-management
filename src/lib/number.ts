export const formatStringToFloat = (value: string): number => {
  const formattedString = value.toString().replace(/\./g, '').replace(',', '.')
  const floatValue = parseFloat(formattedString)

  return floatValue
}
