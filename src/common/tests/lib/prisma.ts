import { PrismaService } from 'nestjs-prisma'

export const prisma = new PrismaService()

export const clearDatabase = async () => {
  await prisma.$transaction([
    prisma.customer.deleteMany(),
    prisma.invoice.deleteMany(),
  ])
}
