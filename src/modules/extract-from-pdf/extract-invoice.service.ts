import { Injectable, Logger } from '@nestjs/common'
import { PDFExtract } from 'pdf.js-extract'

import { ErrorCodeEnum } from '~/common/constants/error-code.constant'
import { BizException } from '~/common/exceptions/biz.exception'

import {
  ExtractAmountsInvoiceDto,
  ExtractAmountsInvoicePositionDto,
  ExtractAmountsInvoiceResponseDto,
  extractAmountsInvoiceResponseSchema,
} from './dtos/extract-amounts-invoice.dto'
import {
  ExtractCustomerInfoDto,
  ExtractCustomerInfoPositionDto,
  extractCustomerInfoResponseSchema,
  ExtractCustomerInfoResponseDto,
} from './dtos/extract-customer-info.dto'

@Injectable()
export class ExtractInvoiceFromPdfService {
  private Logger = new Logger(ExtractInvoiceFromPdfService.name)

  async data(fileUrl: string): Promise<any> {
    const pdfExtract = new PDFExtract()

    try {
      const responseFile = await fetch(fileUrl)
      const file = Buffer.from(await responseFile.arrayBuffer())
      const data = await pdfExtract.extractBuffer(file, {})
      return data
    } catch (error) {
      this.Logger.error(error)
      throw new BizException(ErrorCodeEnum.ExtractDataError)
    }
  }

  customerInfo(
    content: ExtractCustomerInfoDto[],
    positions: ExtractCustomerInfoPositionDto,
  ): ExtractCustomerInfoResponseDto {
    const values: ExtractCustomerInfoResponseDto = {}

    for (const [field, position] of Object.entries(positions)) {
      const { x, y } = position
      const item = content.find(
        (item) =>
          Math.abs(item.x - x) < 6 &&
          Math.abs(item.y - y) < 6 &&
          item.width > 0,
      )

      if (item) {
        values[field] = item.str
      }
    }

    const valuesMapped = extractCustomerInfoResponseSchema.parse(values)

    return valuesMapped
  }

  amountsInvoice(
    content: ExtractAmountsInvoiceDto[],
    positions: ExtractAmountsInvoicePositionDto,
    spacing: number,
  ): ExtractAmountsInvoiceResponseDto[] {
    const values: ExtractAmountsInvoiceResponseDto[] = []
    let index = 0

    while (true) {
      let itemFound = false
      const extractedValues: { [key: string]: string } = {}

      for (const [field, position] of Object.entries(positions)) {
        const { x, y } = position
        const adjustedY = y + index * spacing
        const item = content.find(
          (item) =>
            Math.abs(item.x - x) < 9 &&
            Math.abs(item.y - adjustedY) < 9 &&
            item.width > 0,
        )

        if (item) {
          extractedValues[field] = item.str
          itemFound = true
        }
      }

      if (!itemFound) break

      values.push(extractedValues)
      index++
    }
    const resultsMapped = values.map((result) =>
      extractAmountsInvoiceResponseSchema.parse(result),
    )

    return resultsMapped
  }
}
