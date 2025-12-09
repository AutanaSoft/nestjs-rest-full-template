import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RecoveryPasswordDto {
  @ApiProperty({ example: 'token123', description: 'The recovery token' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  token: string;

  @ApiProperty({ example: 'newpassword123', description: 'The new password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Expose()
  password: string;

  @ApiProperty({ example: 'newpassword123', description: 'Confirmation of the new password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Expose()
  confirmPassword: string;
}
