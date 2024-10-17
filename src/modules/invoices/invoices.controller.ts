import {
  Controller,
  Logger,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'

import { multerConfig } from '~/common/configs/s3-upload.config'
import { ErrorCodeEnum } from '~/common/constants/error-code.constant'
import { BizException } from '~/common/exceptions/biz.exception'
import { FilesValidator } from '~/common/validators/files-upload.validator'

import { UploadInvoiceDto } from './dtos/upload-invoice.dto'
import { InvoicesService } from './invoices.service'

@Controller('invoices')
export class InvoicesController {
  private Logger = new Logger(InvoicesController.name)

  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'invoicesFiles' }], multerConfig),
  )
  uploadInvoice(
    @UploadedFiles(FilesValidator())
    files: UploadInvoiceDto,
  ) {
    try {
      return this.invoicesService.processInvoice(files)
    } catch (error) {
      this.Logger.error(error)
      throw new BizException(ErrorCodeEnum.ErrorCodeUnknown)
    }
  }
}
