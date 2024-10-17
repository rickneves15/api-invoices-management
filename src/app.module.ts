import { Module } from '@nestjs/common'

import { ConfigModule } from '~/common/configs/config.module'
import { ModulesModule } from '~/modules/modules.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [ConfigModule, ModulesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
