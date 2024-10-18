import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { startOfMonth, subMonths } from 'date-fns'
import { PrismaService } from 'nestjs-prisma'
import { createPaginator } from 'prisma-pagination'

import { deleteFiles } from '~/common/configs/s3-upload.config'
import {
  ErrorCode,
  ErrorCodeEnum,
} from '~/common/constants/error-code.constant'
import {
  CUSTOMER_INFO_POSITIONS,
  AMOUNTS_INVOICED_POSITIONS,
  SPACING,
} from '~/common/constants/positions'
import { BizException } from '~/common/exceptions/biz.exception'
import { AmountsInvoiceMapper } from '~/common/mappers/amounts-invoice.mapper'
import { InvoiceDto } from '~/common/models/invoices.model'
import { CustomersService } from '~/modules/customers/customers.service'
import { ExtractInvoiceFromPdfService } from '~/modules/extract-from-pdf/extract-invoice.service'

import { GetInvoicesDto } from './dtos/get-invoices.dtos'
import { GetTotalInvoicesResponseDto } from './dtos/get-total-invoices'
import { UploadInvoiceDto } from './dtos/upload-invoice.dto'

@Injectable()
export class InvoicesService {
  private Logger = new Logger(InvoicesService.name)

  constructor(
    private readonly extractInvoiceFromPdfService: ExtractInvoiceFromPdfService,
    private readonly prisma: PrismaService,
    private readonly customersService: CustomersService,
  ) {}

  async processInvoice(invoices: UploadInvoiceDto) {
    const invoicesToCreate: Prisma.InvoiceCreateManyInput[] = []

    for (const invoice of invoices.invoicesFiles) {
      const data = await this.extractInvoiceFromPdfService.data(
        invoice.location,
      )
      const content = data.pages[0].content

      const customerInfo = this.extractInvoiceFromPdfService.customerInfo(
        content,
        CUSTOMER_INFO_POSITIONS,
      )

      const invoiceExists = await this.getInvoice({
        customerId: customerInfo.customerNumber,
        referenceMonth: customerInfo.referenceMonth,
      })

      if (invoiceExists) {
        this.Logger.log(ErrorCode[ErrorCodeEnum.InvoicesAlreadyExists], {
          message: 'Invoice already exists',
          customerId: customerInfo.customerNumber,
          referenceMonth: customerInfo.referenceMonth,
        })
        await deleteFiles(invoice.location)
        throw new BizException(ErrorCodeEnum.InvoicesAlreadyExists)
      }

      const amountsInvoice = AmountsInvoiceMapper(
        this.extractInvoiceFromPdfService.amountsInvoice(
          content,
          AMOUNTS_INVOICED_POSITIONS,
          SPACING,
        ),
      )

      let customer = await this.customersService.getCustomerByNumber(
        customerInfo.customerNumber,
      )

      if (!customer) {
        customer = await this.customersService.createCustomer({
          name: customerInfo.name,
          customerNumber: customerInfo.customerNumber,
        })
      }

      const invoiceToCreate = await this.createInvoice({
        ...amountsInvoice,
        installationNumber: customerInfo.installationNumber,
        dueDate: customerInfo.dueDate,
        totalAmount: customerInfo.totalAmount,
        referenceMonth: customerInfo.referenceMonth,
        invoiceUrl: invoice.location,
        customer: { connect: { id: customer.id } },
      })

      invoicesToCreate.push(invoiceToCreate)
    }

    return invoicesToCreate
  }

  async getInvoices({
    page,
    perPage,
    customerNumber,
    referenceMonth,
  }: GetInvoicesDto) {
    const paginate = createPaginator({ perPage })

    return paginate<InvoiceDto, Prisma.InvoiceFindManyArgs>(
      this.prisma.invoice,
      {
        where: {
          ...(customerNumber && {
            customerId: BigInt(customerNumber),
          }),
          ...(referenceMonth && {
            referenceMonth: {
              contains: referenceMonth,
              mode: 'insensitive',
            },
          }),
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },

      {
        page,
      },
    )
  }

  async getInvoice(where: Prisma.InvoiceWhereInput) {
    return this.prisma.invoice.findFirst({ where })
  }

  async createInvoice(data: Prisma.InvoiceCreateInput) {
    return this.prisma.invoice.create({ data })
  }

  async getTotalInvoices(): Promise<GetTotalInvoicesResponseDto> {
    const totalInvoices = await this.prisma.invoice.count()

    const currentDate = new Date()
    const startOfCurrentMonth = startOfMonth(currentDate)
    const startOfPreviousMonth = startOfMonth(subMonths(currentDate, 1))

    const invoicesInCurrentMonth = await this.prisma.invoice.count({
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
    })

    const invoicesInPreviousMonth = await this.prisma.invoice.count({
      where: {
        createdAt: {
          gte: startOfPreviousMonth,
          lt: startOfCurrentMonth,
        },
      },
    })

    const difference = invoicesInCurrentMonth - invoicesInPreviousMonth

    return {
      total: totalInvoices,
      difference,
    }
  }
}
