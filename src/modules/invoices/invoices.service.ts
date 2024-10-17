import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

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
import { ExtractInvoiceFromPdfService } from '~/modules/extract-from-pdf/extract-invoice.service'

import { CustomersService } from '../customers/customers.service'
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

    return invoices
  }

  async getInvoice(where: Prisma.InvoiceWhereInput) {
    return this.prisma.invoice.findFirst({ where })
  }

  async createInvoice(data: Prisma.InvoiceCreateInput) {
    return this.prisma.invoice.create({ data })
  }
}
