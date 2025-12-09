import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import {
  SignUpUseCase,
  SignInUseCase,
  ForgotPasswordUseCase,
  RecoveryPasswordUseCase,
  VerifyEmailUseCase,
} from '@modules/auth/application/use-cases';

import {
  SignUpDto,
  SignInDto,
  ForgotPasswordDto,
  RecoveryPasswordDto,
  VerifyEmailDto,
} from '@modules/auth/application/dtos';
import { UserEntity } from '@modules/auth/domain/entities';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly recoveryPasswordUseCase: RecoveryPasswordUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async signUp(@Body() dto: SignUpDto): Promise<UserEntity> {
    return this.signUpUseCase.execute(dto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  async signIn(@Body() dto: SignInDto): Promise<void> {
    return this.signInUseCase.execute(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this.forgotPasswordUseCase.execute(dto);
  }

  @Post('recovery-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  async recoveryPassword(@Body() dto: RecoveryPasswordDto): Promise<void> {
    return this.recoveryPasswordUseCase.execute(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Email successfully verified' })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<void> {
    return this.verifyEmailUseCase.execute(dto);
  }
}
