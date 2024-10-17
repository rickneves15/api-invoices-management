import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const invoiceModelSchema = z.object({
  id: z.string().cuid(),
  installationNumber: z.bigint(),
  referenceMonth: z.string(),
  totalAmount: z.number(),
  dueDate: z.date(),
  energyQuantity: z.number(),
  energyAmount: z.number(),
  exemptEnergyQuantity: z.number().optional(),
  exemptEnergyAmount: z.number().optional(),
  compensatedEnergyQuantity: z.number().optional(),
  compensatedEnergyAmount: z.number().optional(),
  municipalPublicLightingContribution: z.number(),
  invoiceUrl: z.string().url(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export class InvoiceDto extends createZodDto(invoiceModelSchema) {}
