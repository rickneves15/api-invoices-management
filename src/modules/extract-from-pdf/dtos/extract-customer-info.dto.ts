import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { formatStringToDate } from '~/lib/date'
import { formatStringToFloat } from '~/lib/number'

export const extractCustomerInfoSchema = z.object({
  x: z.number(),
  y: z.number(),
  str: z.string(),
  width: z.number(),
  height: z.number(),
  fontName: z.string(),
})

export const extractCustomerInfoPositionSchema = z.record(
  z.string(),
  extractCustomerInfoSchema.pick({
    x: true,
    y: true,
  }),
)

export const extractCustomerInfoResponseSchema = z.object({
  name: z.string(),
  customerNumber: z.coerce.bigint().default(0n),
  installationNumber: z.coerce.bigint().default(0n),
  referenceMonth: z.string(),
  dueDate: z.string().transform((value) => formatStringToDate(value)),
  totalAmount: z.string().transform((value) => formatStringToFloat(value)),
})

export class ExtractCustomerInfoDto extends createZodDto(
  extractCustomerInfoSchema,
) {}
export class ExtractCustomerInfoPositionDto extends createZodDto(
  extractCustomerInfoPositionSchema,
) {}
export class ExtractCustomerInfoResponseDto extends createZodDto(
  extractCustomerInfoResponseSchema,
) {}
