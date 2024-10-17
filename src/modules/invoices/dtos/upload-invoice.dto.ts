import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const uploadInvoicesSchema = z.object({
  invoicesFiles: z.array(
    z.object({
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string(),
      size: z.number(),
      bucket: z.string(),
      key: z.string(),
      acl: z.string(),
      contentType: z.string(),
      contentDisposition: z.null(),
      contentEncoding: z.null(),
      storageClass: z.string(),
      serverSideEncryption: z.null(),
      metadata: z.any(),
      location: z.string(),
      etag: z.string(),
      versionId: z.any(),
    }),
  ),
})

export class UploadInvoiceDto extends createZodDto(uploadInvoicesSchema) {}
