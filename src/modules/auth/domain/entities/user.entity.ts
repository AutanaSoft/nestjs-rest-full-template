import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsEnum } from 'class-validator';
import { UserRole, UserStatus } from '../enums';

/**
 * Domain entity representing a User.
 *
 * Encapsulates the core data and behavior of a user within the domain.
 */
export class UserEntity {
  /** Unique identifier of the user */
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier',
  })
  @Expose()
  id: string;

  /** User's email address */
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @Expose()
  email: string;

  /** Unique username */
  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @Expose()
  userName: string;

  /**
   * Hashed password of the user.
   * Optional because it might not be loaded in all contexts or strictly required for all operations.
   */
  password?: string;

  /** Current status of the user (e.g., ACTIVE, INACTIVE) */
  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE, description: 'User status' })
  @IsEnum(UserStatus)
  @Expose()
  status?: UserStatus;

  /** Role assigned to the user (e.g., USER, ADMIN) */
  @ApiProperty({ enum: UserRole, example: UserRole.USER, description: 'User role' })
  @IsEnum(UserRole)
  @Expose()
  role?: UserRole;

  /** Timestamp when the email was verified */
  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Email verification timestamp',
    required: false,
  })
  @IsDate()
  @Expose()
  emailVerifiedAt?: Date | null;

  /** Timestamp of creation */
  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation timestamp' })
  @IsDate()
  @Expose()
  createdAt?: Date;

  /** Timestamp of last update */
  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Last update timestamp' })
  @IsDate()
  @Expose()
  updatedAt?: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  /**
   * Factory method to create a new User instance.
   *
   * @param email - User's email.
   * @param userName - User's username.
   * @param password - User's hashed password.
   * @returns A new UserEntity instance with basic data.
   */
  static create(email: string, userName: string, password: string): UserEntity {
    return new UserEntity({
      email,
      userName,
      password,
      // status, role, createdAt, updatedAt are left undefined
      // to be handled by Database defaults.
    });
  }
}
