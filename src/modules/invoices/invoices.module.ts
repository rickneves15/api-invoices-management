import { Module } from '@nestjs/common'

import { CustomersService } from '../customers/customers.service'
import { ExtractInvoiceFromPdfService } from '../extract-from-pdf/extract-invoice.service'
import { InvoicesController } from './invoices.controller'
import { InvoicesService } from './invoices.service'

@Module({
  controllers: [InvoicesController],
  providers: [CustomersService, ExtractInvoiceFromPdfService, InvoicesService],
})
export class InvoicesModule {}
