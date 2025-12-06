import { Module } from '@nestjs/common';
import { AppStatusUseCase } from './application/use-cases/app-status.use-case';
import { GetHelloUseCase } from './application/use-cases/get-hello.use-case';
import { AppController } from './infrastructure/controllers/app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [GetHelloUseCase, AppStatusUseCase],
})
export class SharedModule {}
