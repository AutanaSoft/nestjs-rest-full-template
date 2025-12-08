import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicatorResult, HttpHealthIndicator } from '@nestjs/terminus';

import { AppConfig } from '@config/app.config';

/**
 * Use case to perform a ping check on the application itself.
 *
 * @remarks
 * Uses the HttpHealthIndicator to ping the application's root URL to verify it's reachable.
 */
@Injectable()
export class GetAppPingCheckUseCase {
  /**
   * Initializes the use case with required services.
   *
   * @param http - NestJS HttpHealthIndicator for performing health checks.
   * @param configService - NestJS ConfigService to access application configuration.
   */
  constructor(
    private readonly http: HttpHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Executes the ping check.
   *
   * @returns A Promise that resolves to the health indicator result.
   * @throws {InternalServerErrorException} If the application configuration is missing.
   */
  execute(): Promise<HealthIndicatorResult<string>> {
    const appConfig = this.configService.get<AppConfig>('appConfig');

    if (!appConfig) {
      throw new InternalServerErrorException('App configuration not found');
    }

    const url = `http://${appConfig.server.host}:${appConfig.server.port}/`;
    const name = appConfig.name;

    return this.http.pingCheck(name, url);
  }
}
