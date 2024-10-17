import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const PORT = env.PORT || 3333
  await app.listen(PORT)
}
bootstrap()
