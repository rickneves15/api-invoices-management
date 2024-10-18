import { promises as fs } from 'node:fs'

import { deleteFiles, uploadFile } from '~/common/configs/s3-upload.config'

export const getInvoiceTestUrl = async () => {
  const filePath = `${process.cwd()}/assets/invoice-test.pdf`

  const fileBuffer = await fs.readFile(filePath)

  const url = await uploadFile({
    dataBuffer: fileBuffer,
    filename: 'invoice-test.pdf',
    mimetype: 'application/pdf',
  })

  return url
}

export const deleteInvoiceTestUrl = async (fileUrl: string) => {
  await deleteFiles(fileUrl)
}
