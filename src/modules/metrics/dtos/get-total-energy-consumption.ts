import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const getTotalEnergyConsumptionResponseSchema = z.object({
  total: z.number(),
  difference: z.number(),
})

export class GetTotalEnergyConsumptionResponseDto extends createZodDto(
  getTotalEnergyConsumptionResponseSchema,
) {}
