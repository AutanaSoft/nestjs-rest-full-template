import { AppConfig } from '@config/app.config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppStatusDto } from '../dtos';

/**
 * Use case to retrieve the detailed application status.
 *
 * @remarks
 * Collects basic information about the application such as name, description,
 * version, and runtime environment based on the loaded configuration.
 */
@Injectable()
export class GetAppStatusUseCase {
  private readonly appConfig: AppConfig;

  /**
   * Initializes the use case and validates the application configuration.
   *
   * @param configService - NestJS ConfigService to access application configuration.
   * @throws {InternalServerErrorException} If the application configuration is not found.
   */
  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<AppConfig>('appConfig');

    if (!config) {
      throw new InternalServerErrorException('App configuration not found');
    }

    this.appConfig = config;
  }

  /**
   * Executes the use case to retrieve application status details.
   *
   * @returns A DTO containing the application configuration details.
   */
  execute(): AppStatusDto {
    return AppStatusDto.from(this.appConfig);
  }
}
