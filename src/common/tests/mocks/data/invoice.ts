import { faker } from '@faker-js/faker/.'
import { Prisma } from '@prisma/client'

import { MONTHS_ORDER } from '~/common/constants/date'

export const generateMockInvoice = (
  mon: number,
  customerId: bigint,
): Prisma.InvoiceCreateManyInput => {
  const month = MONTHS_ORDER[mon]
  return {
    installationNumber: faker.number.bigInt(),
    referenceMonth: `${month}/2024`,
    totalAmount: faker.number.float({ min: 10, max: 100, multipleOf: 0.02 }),
    dueDate: new Date(2024, mon, 1),
    energyQuantity: faker.number.int(1000),
    energyAmount: faker.number.float({ min: 10, max: 100, multipleOf: 0.02 }),
    exemptEnergyQuantity: faker.number.int(1000),
    exemptEnergyAmount: faker.number.float({
      min: 10,
      max: 100,
      multipleOf: 0.02,
    }),
    compensatedEnergyQuantity: faker.number.int(1000),
    compensatedEnergyAmount: faker.number.float({
      min: 10,
      max: 100,
      multipleOf: 0.02,
    }),
    municipalPublicLightingContribution: faker.number.float({
      max: 0,
      multipleOf: 0.02,
    }),
    invoiceUrl: 'https://invoicesmanagement.s3.amazonaws.com/invoice-test.pdf',
    customerId,
  }
}
