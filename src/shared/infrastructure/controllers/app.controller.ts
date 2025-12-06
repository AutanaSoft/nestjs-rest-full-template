import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppStatusDto, GetHelloDto } from '@shared/application/dtos';
import { AppStatusUseCase } from '@shared/application/use-cases/app-status.use-case';
import { GetHelloUseCase } from '@shared/application/use-cases/get-hello.use-case';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly getHelloUseCase: GetHelloUseCase,
    private readonly appStatusUseCase: AppStatusUseCase,
  ) {}

  @ApiOperation({
    summary: 'Obtener mensaje de bienvenida',
    description: 'Retorna un mensaje de saludo simple.',
  })
  @ApiOkResponse({ description: 'Mensaje obtenido exitosamente', type: GetHelloDto })
  @Get()
  getHello(): GetHelloDto {
    return this.getHelloUseCase.execute();
  }

  @ApiOperation({
    summary: 'Obtener estado de la aplicación',
    description: 'Retorna información sobre el estado y configuración actual de la aplicación.',
  })
  @ApiOkResponse({ description: 'Estado obtenido exitosamente', type: AppStatusDto })
  @Get('status')
  getAppStatus(): AppStatusDto {
    return this.appStatusUseCase.execute();
  }
}
