import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { AppStatusDto } from '@modules/health/application/dtos';
import { GetAppDbCheckUseCase, GetAppStatusUseCase } from '@modules/health/application/use-cases';
import { GetAppPingCheckUseCase } from '@modules/health/application/use-cases/get-app-ping-check.use-case';

/**
 * Controller for application health checks.
 *
 * @remarks
 * Exposes endpoints to verify the application's liveness and retrieve its current status.
 */
@ApiTags('Health')
@Controller('health')
export class HttpHealthController {
  /**
   * Initializes the controller with the health check service and use cases.
   *
   * @param health - NestJS HealthCheckService.
   * @param getAppPingCheckUseCase - Use case for ping check.
   * @param getAppStatusUseCase - Use case for app status.
   */
  constructor(
    private readonly health: HealthCheckService,
    private readonly getAppPingCheckUseCase: GetAppPingCheckUseCase,
    private readonly getAppDbCheckUseCase: GetAppDbCheckUseCase,
    private readonly getAppStatusUseCase: GetAppStatusUseCase,
  ) {}

  /**
   * Performs a health check on the application.
   *
   * @returns The health check result.
   */
  @ApiOperation({
    summary: 'Health check',
    description: 'Verifies if the application is reachable and functioning.',
  })
  @ApiOkResponse({ description: 'Health check successful', type: Object })
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.getAppPingCheckUseCase.execute(),
      () => this.getAppDbCheckUseCase.execute(),
    ]);
  }

  /**
   * Retrieves the application status and metadata.
   *
   * @returns The application status including version and environment.
   */
  @ApiOperation({
    summary: 'Get application status',
    description: 'Retrieves detailed information about the application state.',
  })
  @ApiOkResponse({ description: 'Application status retrieved successfully', type: AppStatusDto })
  @Get('app')
  app() {
    return this.getAppStatusUseCase.execute();
  }
}
