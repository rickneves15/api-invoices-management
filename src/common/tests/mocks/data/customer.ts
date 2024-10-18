import { faker } from '@faker-js/faker/.'
import { Prisma } from '@prisma/client'

export const generateMockCustomer = (): Prisma.CustomerCreateInput => {
  return {
    customerNumber: faker.number.bigInt(),
    name: faker.person.fullName(),
  }
}

const mockCustomerData = generateMockCustomer()

export { mockCustomerData }
