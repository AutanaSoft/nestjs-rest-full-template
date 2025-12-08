import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import {
  GetAppPingCheckUseCase,
  GetAppRootUseCase,
  GetAppStatusUseCase,
} from './application/use-cases';
import { AppController, HttpHealthController } from './infrastructure/controllers';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [AppController, HttpHealthController],
  providers: [GetAppRootUseCase, GetAppStatusUseCase, GetAppPingCheckUseCase],
  exports: [],
})
export class HealthModule {}
