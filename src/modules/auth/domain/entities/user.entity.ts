import { UserRole, UserStatus } from '../enums';

/**
 * Domain entity representing a User.
 *
 * Encapsulates the core data and behavior of a user within the domain.
 */
export class UserEntity {
  /** Unique identifier of the user */
  id: string;

  /** User's email address */
  email: string;

  /** Unique username */
  userName: string;

  /**
   * Hashed password of the user.
   * Optional because it might not be loaded in all contexts or strictly required for all operations.
   */
  password?: string;

  /** Current status of the user (e.g., ACTIVE, INACTIVE) */
  status: UserStatus;

  /** Role assigned to the user (e.g., USER, ADMIN) */
  role: UserRole;

  /** Timestamp when the email was verified */
  emailVerifiedAt?: Date | null;

  /** Timestamp of creation */
  createdAt: Date;

  /** Timestamp of last update */
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
