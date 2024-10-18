import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { PER_PAGE } from '~/common/constants/paginate'

export const getInvoicesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(PER_PAGE),
  customerNumber: z.bigint().optional(),
  referenceMonth: z.string().optional(),
})

export class GetInvoicesDto extends createZodDto(getInvoicesSchema) {}
