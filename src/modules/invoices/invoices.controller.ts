import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'

import { multerConfig } from '~/common/configs/s3-upload.config'
import { FilesValidator } from '~/common/validators/files-upload.validator'

import { UploadInvoiceDto } from './dtos/upload-invoice.dto'
import { InvoicesService } from './invoices.service'

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'invoicesFiles' }], multerConfig),
  )
  uploadInvoice(
    @UploadedFiles(FilesValidator())
    files: UploadInvoiceDto,
  ) {
    return {
      urls: files.invoicesFiles.map((file) => file.location),
    }
  }
}
