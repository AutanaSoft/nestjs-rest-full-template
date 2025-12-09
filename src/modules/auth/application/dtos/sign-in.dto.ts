import { ApiProperty } from '@nestjs/swagger';
import { IsAllowedData } from '@modules/auth/application/decorators/is-allowed-data.decorator';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO for user sign in.
 * Validates credentials for authentication.
 */
export class SignInDto {
  /**
   * User email address.
   * Validations: email format, max 64 chars, forbidden domains.
   * Transformation: trim spaces and convert to lowercase.
   */
  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(64)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsAllowedData('email')
  email: string;

  /**
   * User password.
   * Validations: non-empty string.
   * Transformation: trim spaces.
   */
  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  password: string;
}
