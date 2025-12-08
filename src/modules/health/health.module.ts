import { DatabaseModule } from '@modules/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import {
  GetAppPingCheckUseCase,
  GetAppRootUseCase,
  GetAppStatusUseCase,
  GetAppDbCheckUseCase,
  GetAppDiskCheckUseCase,
} from './application/use-cases';
import { AppController, HttpHealthController } from './infrastructure/controllers';

@Module({
  imports: [TerminusModule, HttpModule, DatabaseModule],
  controllers: [AppController, HttpHealthController],
  providers: [
    GetAppRootUseCase,
    GetAppStatusUseCase,
    GetAppPingCheckUseCase,
    GetAppDbCheckUseCase,
    GetAppDiskCheckUseCase,
  ],
  exports: [],
})
export class HealthModule {}
