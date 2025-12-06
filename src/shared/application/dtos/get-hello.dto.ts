import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

/**
 * DTO que define la estructura de la respuesta para el mensaje de saludo.
 * Utilizado para exponer información básica como nombre, versión y modo de ejecución.
 */
export class GetHelloDto {
  /**
   * Mensaje de saludo.
   */
  @ApiProperty({ description: 'Mensaje de saludo', example: 'Hello World!' })
  @IsString()
  @Expose()
  message: string;
}
