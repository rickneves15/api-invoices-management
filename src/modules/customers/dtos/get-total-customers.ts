import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const getTotalCustomersResponseSchema = z.object({
  total: z.number(),
  difference: z.number(),
})

export class GetTotalCustomersResponseDto extends createZodDto(
  getTotalCustomersResponseSchema,
) {}
