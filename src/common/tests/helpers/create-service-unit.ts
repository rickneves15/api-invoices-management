import { ModuleMetadata } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule, PrismaService } from 'nestjs-prisma'
import { ZodValidationPipe } from 'nestjs-zod'

import { clearDatabase } from '../lib/prisma'

type ClassType<T> = new (...args: any[]) => T

type CreateTestingModuleOptions<T> = {
  Service: ClassType<T>
  module?: ModuleMetadata
  services?: any[]
}

export const createServiceUnitTestApp = <T>({
  Service,
  module,
  services,
}: CreateTestingModuleOptions<T>) => {
  const proxy = {} as {
    service: T
    app: TestingModule
  }

  beforeAll(async () => {
    const { imports, providers } = module || {}
    const app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [`${process.cwd()}/.env`],
          cache: true,
          isGlobal: true,
        }),

        PrismaModule.forRoot({
          isGlobal: true,
        }),
        ...(imports || []),
      ],
      providers: [
        PrismaService,
        Service,
        ...(services || []),
        {
          provide: APP_PIPE,
          useClass: ZodValidationPipe,
        },
        ...(providers || []),
      ],
    }).compile()

    await app.init()
    await clearDatabase()

    const service = app.get<T>(Service)
    proxy.service = service
    proxy.app = app
  })

  afterAll(async () => {
    await clearDatabase()
  })

  return proxy
}
