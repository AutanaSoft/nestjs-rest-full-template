import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '@modules/database/database.module';
import { SharedModule } from '@shared/shared.module';
import { UsersModule } from '../users/users.module';

import { AuthController } from './infrastructure/controllers/auth.controller';

import {
  ForgotPasswordUseCase,
  RecoveryPasswordUseCase,
  SignInUseCase,
  SignUpUseCase,
  VerifyEmailUseCase,
} from '@modules/auth/application/use-cases';

import jwtConfig, { createJwtAccessModuleOptions } from '@/config/jwt.config';
import { JwtAuthGuard } from './application/guards/jwt-auth.guard';
import { JwtTempAuthGuard } from './application/guards/jwt-temp-auth.guard';
import { PermissionsGuard } from './application/guards/permissions.guard';
import { TokenService } from './domain/services/token.service';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { JwtTempStrategy } from './infrastructure/strategies/jwt-temp.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: createJwtAccessModuleOptions,
      inject: [jwtConfig.KEY],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    SignUpUseCase,
    SignInUseCase,
    ForgotPasswordUseCase,
    RecoveryPasswordUseCase,
    VerifyEmailUseCase,
    // Services
    {
      provide: TokenService,
      useClass: JwtTokenService,
    },
    // Strategies
    JwtStrategy,
    JwtTempStrategy,
    // Guards
    JwtAuthGuard,
    JwtTempAuthGuard,
    PermissionsGuard,
  ],
  exports: [TokenService, PassportModule, JwtModule],
})
export class AuthModule {}
