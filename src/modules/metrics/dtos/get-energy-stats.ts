import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const getEnergyStatsResponseSchema = z.object({
  referenceMonth: z.string(),
  energyConsumption: z.number(),
  energyCompensated: z.number(),
})

export class GetEnergyStatsResponseDto extends createZodDto(
  getEnergyStatsResponseSchema,
) {}
