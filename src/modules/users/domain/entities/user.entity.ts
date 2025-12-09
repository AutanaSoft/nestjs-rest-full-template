import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRole, UserStatus } from '../enums';

export class UserEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' })
  @Expose()
  id?: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @Expose()
  email!: string;

  /**
   * Internal property for checking uniqueness or searching.
   * Not exposed to the API response usually, although here it is marked Expose.
   * If we want to hide it, we should remove @Expose or use @Exclude.
   */
  @Expose()
  emailHash?: string;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @Expose()
  userName!: string;

  // Password should NEVER be exposed.
  password?: string;

  @ApiProperty({ enum: UserStatus, example: UserStatus.REGISTERED, description: 'User status' })
  @Expose()
  status: UserStatus = UserStatus.REGISTERED;

  @ApiProperty({ enum: UserRole, example: UserRole.USER, description: 'User role' })
  @Expose()
  role: UserRole = UserRole.USER;

  /** Timestamp of email verification */
  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Email verification timestamp',
    required: false,
  })
  @Expose()
  emailVerifiedAt?: Date | null;

  /** Timestamp of creation */
  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation timestamp' })
  @Expose()
  createdAt?: Date;

  /** Timestamp of last update */
  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Last update timestamp' })
  @Expose()
  updatedAt?: Date;

  /**
   * Private constructor to enforce Factory methods usage.
   *
   * @param partial - Partial user data.
   */
  private constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  /**
   * Factory method to create a new User instance (Business Logic).
   *
   * Use this method when creating a NEW user in the system.
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

  /**
   * Factory method to restore a User instance from persistence (Reconstitution).
   *
   * Use this method when hydrating an existing user from the database or other source.
   * Trust the source data and do not apply creation business rules.
   *
   * @param data - The data to reconstitute the entity.
   * @returns A fully hydrated UserEntity.
   */
  static restore(data: Partial<UserEntity>): UserEntity {
    return new UserEntity(data);
  }
}
