import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

/**
 * DTO que define la estructura de la respuesta para el mensaje de saludo.
 * Utilizado para exponer información básica como nombre, versión y modo de ejecución.
 */
export class GetHelloDto {
  @IsString()
  @Expose()
  message: string;
}
