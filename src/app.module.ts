import appConfig from '@config/app.config';
import corsConfig from '@config/cors.config';
import cryptoConfig from '@config/crypto.config';
import loggerConfig, { createLoggerModuleOptions } from '@config/logger.config';
import throttlerConfig, { createThrottlerModuleOptions } from '@config/throttler.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from '@shared/shared.module';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './modules/health/health.module';

import databaseConfig from '@config/database.config';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        appConfig,
        corsConfig,
        loggerConfig,
        throttlerConfig,
        cryptoConfig,
        databaseConfig,
        jwtConfig,
      ],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule.forFeature(loggerConfig)],
      inject: [loggerConfig.KEY],
      useFactory: createLoggerModuleOptions,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule.forFeature(throttlerConfig)],
      inject: [throttlerConfig.KEY],
      useFactory: createThrottlerModuleOptions,
    }),
    SharedModule,
    HealthModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
