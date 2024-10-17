import { Controller, Get, Logger } from '@nestjs/common'

import { ErrorCodeEnum } from '~/common/constants/error-code.constant'
import { BizException } from '~/common/exceptions/biz.exception'

import { CustomersService } from './customers.service'

@Controller('customers')
export class CustomersController {
  private Logger = new Logger(CustomersController.name)

  constructor(private readonly customersService: CustomersService) {}

  @Get()
  getCustomers() {
    try {
      return this.customersService.getCustomers()
    } catch (error) {
      this.Logger.error(error)
      throw new BizException(ErrorCodeEnum.ErrorCodeUnknown)
    }
  }
}
