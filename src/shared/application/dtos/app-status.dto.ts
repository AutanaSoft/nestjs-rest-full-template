import type { LogLevel } from '@config/app.config';
import { AppConfig } from '@config/app.config';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

/**
 * DTO que representa el estado público de la aplicación.
 *
 * Este objeto se utiliza para exponer información de configuración no sensible
 * a los clientes de la API, permitiendo verificar la versión y el entorno.
 */
export class AppStatusDto {
  /**
   * Nombre de la aplicación.
   */
  @IsString()
  @Expose()
  name: string;

  /**
   * Descripción breve del propósito de la aplicación.
   */
  @IsString()
  @Expose()
  description: string;

  /**
   * Versión actual de la aplicación (SemVer).
   */
  @IsString()
  @Expose()
  version: string;

  /**
   * Entorno en el que se está ejecutando la aplicación (ej. development, production).
   */
  @IsString()
  @Expose()
  mode: string;

  /**
   * Nivel de detalle configurado para el sistema de logging.
   */
  @IsString()
  @Expose()
  logLevel: LogLevel;

  /**
   * Crea una instancia de AppStatusDto a partir de la configuración interna.
   *
   * @param config - Objeto de configuración de la aplicación.
   * @returns Nueva instancia de AppStatusDto con los datos mapeados.
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
