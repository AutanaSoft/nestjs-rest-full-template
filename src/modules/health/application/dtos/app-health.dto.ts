import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

import { AppConfig, type LogLevel } from '@config/app.config';
import { AppStatusEnum } from '../enums';

/**
 * Data Transfer Object for application root response.
 *
 * @remarks
 * Represents the basic health check response structure.
 */
export class AppRootDto {
  /**
   * Service status indicator.
   *
   * @example 'up'
   */
  @ApiProperty({ description: 'Service status', example: 'up', enum: AppStatusEnum })
  @IsEnum(AppStatusEnum)
  @Expose()
  status: AppStatusEnum;

  /**
   * Creates an AppRootDto instance from the application configuration.
   *
   * @param status - The application status
   * @returns A populated AppRootDto instance
   */
  static from(status: AppStatusEnum): AppRootDto {
    const dto = new AppRootDto();
    dto.status = status;
    return dto;
  }
}

/**
 * Data Transfer Object for detailed application status.
 *
 * @remarks
 * Contains comprehensive information about the application's runtime configuration
 * and environment.
 */
export class AppStatusDto {
  /**
   * Application name.
   */
  @ApiProperty({ description: 'Application name' })
  @IsString()
  @Expose()
  name: string;

  /**
   * Brief description of the application purpose.
   */
  @ApiProperty({ description: 'Brief description of the application purpose' })
  @IsString()
  @Expose()
  description: string;

  /**
   * Current application version (SemVer).
   */
  @ApiProperty({ description: 'Current application version (SemVer)' })
  @IsString()
  @Expose()
  version: string;

  /**
   * Runtime environment mode.
   */
  @ApiProperty({ description: 'Runtime environment' })
  @IsString()
  @Expose()
  mode: string;

  /**
   * Configured logging level.
   */
  @ApiProperty({ description: 'Configured log level' })
  @IsString()
  @Expose()
  logLevel: LogLevel;

  /**
   * Creates an AppStatusDto instance from the application configuration.
   *
   * @param config - The application configuration object
   * @returns A populated AppStatusDto instance
   */
  static from(config: AppConfig): AppStatusDto {
    const dto = new AppStatusDto();
    dto.name = config.name;
    dto.description = config.description;
    dto.version = config.version;
    dto.mode = config.mode;
    dto.logLevel = config.logLevel;
    return dto;
  }
}
