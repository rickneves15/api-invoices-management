import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { extname } from 'path'

import { UploadInvoiceDto } from '~/modules/invoices/dtos/upload-invoice.dto'

import { INVOICE_FILE_TYPES } from '../constants/files'

export function FilesValidator(): PipeTransform {
  return new FilesPipe()
}

@Injectable()
export class FilesPipe implements PipeTransform {
  transform(values: UploadInvoiceDto): UploadInvoiceDto {
    if (!values) {
      throw new BadRequestException('File not found')
    }

    values.invoicesFiles.forEach((file) => {
      const extension = extname(file.originalname)
      if (!INVOICE_FILE_TYPES.includes(extension)) {
        throw new BadRequestException(`File type ${extension} not supported`)
      }
    })

    return values
  }
}
