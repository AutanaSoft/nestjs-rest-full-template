import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database/database.module';
import { SharedModule } from '@shared/shared.module';

import { AuthController } from './infrastructure/controllers/auth.controller';

import {
  SignUpUseCase,
  SignInUseCase,
  ForgotPasswordUseCase,
  RecoveryPasswordUseCase,
  VerifyEmailUseCase,
} from '@modules/auth/application/use-cases';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, SharedModule, UsersModule],
  controllers: [AuthController],
  providers: [
    // Use Cases
    SignUpUseCase,
    SignInUseCase,
    ForgotPasswordUseCase,
    RecoveryPasswordUseCase,
    VerifyEmailUseCase,
    // Repositories
  ],
  exports: [],
})
export class AuthModule {}
