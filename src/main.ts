import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfigFactory } from './config/app.config';

/**
 * Inicializa la aplicación NestJS.
 *
 * Configura el logger global, carga la configuración de la aplicación
 * e inicia el servidor HTTP escuchando en el host y puerto definidos
 * en la configuración.
 *
 * @returns Promesa que se resuelve cuando la aplicación se ha iniciado.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar logger
  const logger = new Logger('Bootstrap');
  app.useLogger(logger);

  // Obtener las configuraciones
  const _appConfig = appConfigFactory();

  await app.listen(_appConfig.server.port, _appConfig.server.host);
  logger.log(`Server is running on port ${await app.getUrl()}`);
}

/**
 * Ejecuta el proceso de inicialización de la aplicación.
 *
 * Maneja cualquier error no capturado durante el arranque, registrándolo
 * en la consola y terminando el proceso con un código de error (1).
 */
bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
