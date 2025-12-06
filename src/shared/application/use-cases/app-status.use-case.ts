import { AppConfig } from '@config/app.config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppStatusDto } from '../dtos';

/**
 * Caso de uso para obtener el estado actual de la aplicación.
 *
 * Esta clase se encarga de recopilar información básica sobre la aplicación,
 * como su nombre, descripción, versión y el entorno en el que se está ejecutando,
 * basándose en la configuración cargada.
 */

@Injectable()
export class AppStatusUseCase {
  private readonly appConfig: AppConfig;

  /**
   * Constructor que inyecta el servicio de configuración.
   *
   * @param {ConfigService} configService - Servicio de configuración de NestJS.
   */
  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<AppConfig>('appConfig');

    if (!config) {
      throw new InternalServerErrorException('App configuration not found');
    }

    this.appConfig = config;
  }

  /**
   * Ejecuta el caso de uso para recuperar la información de estado de la aplicación.
   *
   * @returns {AppStatusDto} DTO con los detalles de configuración de la aplicación.
   */

  execute(): AppStatusDto {
    return AppStatusDto.from(this.appConfig);
  }
}
