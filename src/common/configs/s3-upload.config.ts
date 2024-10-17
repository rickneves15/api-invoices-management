import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { UnsupportedMediaTypeException } from '@nestjs/common'
import * as multerS3 from 'multer-s3'
import * as path from 'path'
import { v7 as uuidv7 } from 'uuid'

import { env } from '~/env'

const s3Config = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export const multerConfig = {
  storage: multerS3({
    s3: s3Config,
    bucket: env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file: Express.MulterS3.File, cb) => {
      const filetypes = /pdf/
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
      )
      const mimetype = filetypes.test(file.mimetype)

      if (mimetype && extname) {
        const fileName =
          path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv7()

        const extension = path.parse(file.originalname).ext
        cb(null, `${fileName}${extension}`)
      } else {
        cb(
          new UnsupportedMediaTypeException(
            'Invalid file type. Only PDFs are allowed.',
          ),
        )
      }
    },
  }),
}

export const deleteFiles = async (fileurl: string) => {
  const params = {
    Bucket: env.AWS_BUCKET_NAME,
    Key: fileurl.replace(
      'https://invoicesmanagement.s3.us-west-2.amazonaws.com/',
      '',
    ),
  }

  await s3Config.send(new DeleteObjectCommand(params))
}
