import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomerByNumber(customerNumber: bigint) {
    return this.prisma.customer.findUnique({
      where: {
        customerNumber,
      },
    })
  }

  async createCustomer(customer: Prisma.CustomerCreateInput) {
    return this.prisma.customer.create({
      data: customer,
    })
  }
}
