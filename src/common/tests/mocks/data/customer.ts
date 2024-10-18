import { faker } from '@faker-js/faker/.'
import { Prisma } from '@prisma/client'

export const generateMockUser = (): Prisma.CustomerCreateInput => {
  return {
    customerNumber: faker.number.bigInt(),
    name: faker.person.fullName(),
  }
}

const mockUserData = generateMockUser()

export { mockUserData }
