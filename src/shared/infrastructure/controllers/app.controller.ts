import { Controller, Get } from '@nestjs/common';
import { AppStatusDto, GetHelloDto } from '@shared/application/dtos';
import { AppStatusUseCase } from '@shared/application/use-cases/app-status.use-case';
import { GetHelloUseCase } from '@shared/application/use-cases/get-hello.use-case';

@Controller()
export class AppController {
  constructor(
    private readonly getHelloUseCase: GetHelloUseCase,
    private readonly appStatusUseCase: AppStatusUseCase,
  ) {}

  @Get()
  getHello(): GetHelloDto {
    return this.getHelloUseCase.execute();
  }

  @Get('status')
  getAppStatus(): AppStatusDto {
    return this.appStatusUseCase.execute();
  }
}
