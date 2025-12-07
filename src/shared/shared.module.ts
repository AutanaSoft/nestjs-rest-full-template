import { Module } from '@nestjs/common';
import { AppStatusUseCase } from './application/use-cases/app-status.use-case';
import { GetHelloUseCase } from './application/use-cases/get-hello.use-case';
import { AppController } from './infrastructure/controllers/app.controller';
import { CryptoService } from './infrastructure/services/crypto.service';

@Module({
  controllers: [AppController],
  exports: [CryptoService],
  providers: [CryptoService, GetHelloUseCase, AppStatusUseCase],
})
export class SharedModule {}
