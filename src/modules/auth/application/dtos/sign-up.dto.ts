import { IsEmail, IsNotEmpty, IsString, Length, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsAllowedData } from '@modules/auth/application/decorators/is-allowed-data.decorator';

/**
 * DTO for user registration (Sign Up).
 * Validates the payload required to create a new user.
 */
export class SignUpDto {
  /**
   * User email address.
   * Validations: email format, max 64 chars, forbidden domains.
   * Transformation: trim spaces and convert to lowercase.
   */
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
   * Username.
   * Validations: 3-20 chars, start with letter, alphanumeric only, forbidden names.
   * Transformation: trim spaces.
   */
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z]/, { message: 'Username must start with a letter' })
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Username must contain only letters and numbers' })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsAllowedData('username')
  userName: string;

  /**
   * User password.
   * Validations: 6-16 chars, alphanumeric, special chars required.
   * Transformation: trim spaces (caution: usually passwords are not trimmed, but requested by user for all inputs).
   */
  @IsNotEmpty()
  @IsString()
  @Length(6, 16)
  @Matches(/^[a-zA-Z0-9$#*?!%]+$/, {
    message: 'Password can only contain letters, numbers, and $#*?!% characters',
  })
  @Matches(/(?=.*[$#*?!%])/, {
    message: 'Password must contain at least one special character: $#*?!%',
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  password: string;
}
