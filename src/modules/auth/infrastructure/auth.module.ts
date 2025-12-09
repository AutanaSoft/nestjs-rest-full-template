import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database/database.module';

import { AuthController } from './controllers/auth.controller';

import {
  SignUpUseCase,
  SignInUseCase,
  ForgotPasswordUseCase,
  RecoveryPasswordUseCase,
  VerifyEmailUseCase,
} from '@modules/auth/application/use-cases';

import { AuthRepository } from '@modules/auth/domain/repositories';
import { AuthRepositoryImpl } from '@modules/auth/infrastructure/persistence';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    // Use Cases
    SignUpUseCase,
    SignInUseCase,
    ForgotPasswordUseCase,
    RecoveryPasswordUseCase,
    VerifyEmailUseCase,
    // Repositories
    {
      provide: AuthRepository,
      useClass: AuthRepositoryImpl,
    },
  ],
  exports: [],
})
export class AuthModule {}
