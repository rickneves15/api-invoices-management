import { Module } from '@nestjs/common'

import { CustomersModule } from './customers/custumers.module'
import { InvoicesModule } from './invoices/invoices.module'
import { MetricsModule } from './metrics/metrics.module'

@Module({
  imports: [CustomersModule, InvoicesModule, MetricsModule],
  controllers: [],
  providers: [],
})
export class ModulesModule {}
