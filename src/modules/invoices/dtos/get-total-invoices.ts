import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const getTotalInvoicesResponseSchema = z.object({
  total: z.number(),
  difference: z.number(),
})

export class GetTotalInvoicesResponseDto extends createZodDto(
  getTotalInvoicesResponseSchema,
) {}
