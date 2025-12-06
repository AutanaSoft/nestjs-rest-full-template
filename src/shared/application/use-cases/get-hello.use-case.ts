import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GetHelloDto } from '../dtos';

/**
 * Caso de uso para obtener el mensaje de saludo.
 *
 * @returns {GetHelloDto} DTO con el mensaje de saludo.
 */
@Injectable()
export class GetHelloUseCase {
  /**
   * Ejecuta el caso de uso para recuperar el mensaje de saludo.
   *
   * @returns {GetHelloDto} DTO con el mensaje de saludo.
   */
  execute(): GetHelloDto {
    const message = 'Hello World!';
    return plainToInstance(GetHelloDto, { message });
  }
}
