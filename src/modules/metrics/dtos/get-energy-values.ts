import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const getEnergyValuesResponseSchema = z.object({
  referenceMonth: z.string(),
  consumedEnergyValue: z.number(),
  compensatedEnergyValue: z.number(),
})

export class GetEnergyValuesResponseDto extends createZodDto(
  getEnergyValuesResponseSchema,
) {}
