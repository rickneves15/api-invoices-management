import { Module } from '@nestjs/common'

import { CustomersService } from '~/modules/customers/customers.service'
import { ExtractInvoiceFromPdfService } from '~/modules/extract-from-pdf/extract-invoice.service'
import { InvoicesService } from '~/modules/invoices/invoices.service'

import { MetricsController } from './metrics.controller'
import { MetricsService } from './metrics.service'

@Module({
  controllers: [MetricsController],
  providers: [
    CustomersService,
    ExtractInvoiceFromPdfService,
    InvoicesService,
    MetricsService,
  ],
})
export class MetricsModule {}
