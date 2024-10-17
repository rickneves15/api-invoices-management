import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { formatStringToFloat } from '~/lib/number'

export const extractAmountsInvoiceSchema = z.object({
  x: z.number(),
  y: z.number(),
  str: z.string(),
  width: z.number(),
  height: z.number(),
  fontName: z.string(),
})

export const extractAmountsInvoicePositionSchema = z.record(
  z.string(),
  extractAmountsInvoiceSchema.pick({
    x: true,
    y: true,
  }),
)

export const extractAmountsInvoiceResponseSchema = z.object({
  name: z.string(),
  quantity: z.coerce.number().nullish(),
  amount: z.string().transform((value) => formatStringToFloat(value)),
})

export class ExtractAmountsInvoiceDto extends createZodDto(
  extractAmountsInvoiceSchema,
) {}
export class ExtractAmountsInvoicePositionDto extends createZodDto(
  extractAmountsInvoicePositionSchema,
) {}
export class ExtractAmountsInvoiceResponseDto extends createZodDto(
  extractAmountsInvoiceResponseSchema,
) {}
