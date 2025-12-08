import { AppConfig } from '@config/app.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppRootDto } from '../dtos';
import { AppStatusEnum } from '../enums';

/**
 * Use case to get the root application status.
 *
 * @remarks
 * Verifies if the application configuration is loadable and returns a basic status.
 */
@Injectable()
export class GetAppRootUseCase {
  /**
   * Initializes the use case with the configuration service.
   *
   * @param configService - NestJS ConfigService to access application configuration.
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * Executes the use case to obtain the basic application status.
   *
   * @returns An AppRootDto with the current status ('up' or 'down').
   */
  execute(): AppRootDto {
    const config = this.configService.get<AppConfig>('appConfig');
    let ready = AppStatusEnum.UP;

    if (!config) {
      ready = AppStatusEnum.DOWN;
    }

    const appRoot = AppRootDto.from(ready);
    return appRoot;
  }
}
