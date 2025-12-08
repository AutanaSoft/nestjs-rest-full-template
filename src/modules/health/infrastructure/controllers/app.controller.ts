import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppRootDto } from '@modules/health/application/dtos';
import { GetAppRootUseCase } from '@modules/health/application/use-cases/get-app-root.use-case';

/**
 * Controller to handle root application requests.
 *
 * @remarks
 * Provides endpoints for basic health checks and application status.
 */
@ApiTags('Root')
@Controller()
export class AppController {
  /**
   * Initializes the controller with required use cases.
   *
   * @param getAppRootUseCase - Use case to get application root status.
   */
  constructor(private readonly getAppRootUseCase: GetAppRootUseCase) {}

  /**
   * Gets the service status.
   *
   * @returns The application root DTO with status.
   */
  @ApiOperation({
    summary: 'Get service status',
    description: 'Returns a simple status confirming that the service is active.',
  })
  @ApiOkResponse({
    description: 'Status retrieved successfully',
    type: AppRootDto,
  })
  @Get()
  getHello(): AppRootDto {
    return this.getAppRootUseCase.execute();
  }
}
