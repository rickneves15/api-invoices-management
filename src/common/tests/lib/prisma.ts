import { PrismaService } from 'nestjs-prisma'
import { env } from '~/env'

export const prisma = new PrismaService({
  prismaOptions: {
    datasourceUrl: env.POSTGRES_PRISMA_URL,
  },
})

export const clearDatabase = async () => {
  await prisma.$transaction([
    prisma.customer.deleteMany(),
    prisma.invoice.deleteMany(),
  ])
}
