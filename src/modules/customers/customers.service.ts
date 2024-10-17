import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { startOfMonth, subMonths } from 'date-fns'
import { PrismaService } from 'nestjs-prisma'

import { GetTotalCustomersResponseDto } from './dtos/get-total-customers'

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomers() {
    return this.prisma.customer.findMany()
  }

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

  async getTotalCustomers(): Promise<GetTotalCustomersResponseDto> {
    const totalCustomers = await this.prisma.customer.count()

    const currentDate = new Date()
    const startOfCurrentMonth = startOfMonth(currentDate)
    const startOfPreviousMonth = startOfMonth(subMonths(currentDate, 1))

    const customersInCurrentMonth = await this.prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
    })

    const customersInPreviousMonth = await this.prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfPreviousMonth,
          lt: startOfCurrentMonth,
        },
      },
    })

    const difference = customersInCurrentMonth - customersInPreviousMonth

    return {
      total: totalCustomers,
      difference,
    }
  }
}
