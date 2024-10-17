import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { env } from './env'

// Config for BigInt to fixed JSON.stringify() doesn't know how to serialize a BigInt, this is error in JSON.stringify(), possible error in nestjs
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return this.toString()
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const PORT = env.PORT || 3333
  await app.listen(PORT)
}
bootstrap()
