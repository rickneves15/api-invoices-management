import { Controller, Get, Logger, Query } from '@nestjs/common'

import { ErrorCodeEnum } from '~/common/constants/error-code.constant'
import { BizException } from '~/common/exceptions/biz.exception'
import { CustomersService } from '~/modules/customers/customers.service'
import { InvoicesService } from '~/modules/invoices/invoices.service'

import { MetricsService } from './metrics.service'

@Controller('metrics')
export class MetricsController {
  private Logger = new Logger(MetricsController.name)

  constructor(
    private readonly metricsService: MetricsService,
    private readonly customersService: CustomersService,
    private readonly invoicesService: InvoicesService,
  ) {}

  @Get('energy-stats')
  getEnergyStats(@Query('customerNumber') customerNumber: bigint) {
    try {
      return this.metricsService.getEnergyStats(customerNumber)
    } catch (error) {
      this.Logger.error(error)
      throw new BizException(ErrorCodeEnum.ErrorCodeUnknown)
    }
  }

  @Get('energy-values')
  getEnergyValues() {
    try {
      return this.metricsService.getEnergyValues()
    } catch (error) {
      this.Logger.error(error)
      throw new BizException(ErrorCodeEnum.ErrorCodeUnknown)
    }
  }

  @Get('total-customers')
  getTotalCustomers() {
    try {
      return this.customersService.getTotalCustomers()
    } catch (error) {
      this.Logger.error(error)
      throw new BizException(ErrorCodeEnum.ErrorCodeUnknown)
    }
  }

  @Get('total-energy-compensated')
  totalEnergyCompensated() {
    try {
      return this.metricsService.getTotalEnergyCompensated()
    } catch (error) {
      this.Logger.error(error)
      throw new BizException(ErrorCodeEnum.ErrorCodeUnknown)
    }
  }

  @Get('total-energy-consumption')
  getTotalEnergyConsumption() {
    try {
      return this.metricsService.getTotalEnergyConsumption()
    } catch (error) {
      this.Logger.error(error)
      throw new BizException(ErrorCodeEnum.ErrorCodeUnknown)
    }
  }

  @Get('total-invoices')
  getTotalInvoices() {
    try {
      return this.invoicesService.getTotalInvoices()
    } catch (error) {
      this.Logger.error(error)
      throw new BizException(ErrorCodeEnum.ErrorCodeUnknown)
    }
  }
}
