import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env`],
      cache: true,
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class ConfigModule {}
