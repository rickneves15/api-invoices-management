import { ExtractAmountsInvoiceResponseDto } from '~/modules/extract-from-pdf/dtos/extract-amounts-invoice.dto'

export type AmountsInvoiceResponseMapper = {
  energyQuantity: number
  energyAmount: number
  exemptEnergyQuantity: number
  exemptEnergyAmount: number
  compensatedEnergyQuantity: number
  compensatedEnergyAmount: number
  municipalPublicLightingContribution: number
}

export const AmountsInvoiceMapper = (
  amounts: ExtractAmountsInvoiceResponseDto[],
): AmountsInvoiceResponseMapper => {
  // eslint-disable-next-line prefer-const
  let result: AmountsInvoiceResponseMapper = {
    energyQuantity: 0,
    energyAmount: 0,
    exemptEnergyQuantity: 0,
    exemptEnergyAmount: 0,
    compensatedEnergyQuantity: 0,
    compensatedEnergyAmount: 0,
    municipalPublicLightingContribution: 0,
  }

  for (const item of amounts) {
    const { name, quantity, amount } = item

    switch (name) {
      case 'Energia Elétrica':
        result = {
          ...result,
          energyQuantity: quantity,
          energyAmount: amount,
        }
        break
      case 'Energia SCEE s/ ICMS':
      case 'Energia SCEE ISENTA':
      case 'En comp. s/ ICMS':
        result.exemptEnergyQuantity = quantity
        result.exemptEnergyAmount = amount
        break
      case 'Energia compensada GD I':
      case 'Energia injetada HFP':
        result.compensatedEnergyQuantity = quantity
        result.compensatedEnergyAmount = amount
        break
      case 'Contrib Ilum Publica Municipal':
        result.municipalPublicLightingContribution = amount
        break
      default:
        break
    }
  }

  return result
}
