import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const getTotalEnergyCompensatedResponseSchema = z.object({
  total: z.number(),
  difference: z.number(),
})

export class GetTotalEnergyCompensatedResponseDto extends createZodDto(
  getTotalEnergyCompensatedResponseSchema,
) {}
