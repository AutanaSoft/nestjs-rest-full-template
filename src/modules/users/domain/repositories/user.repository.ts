import { UserEntity } from '../entities/user.entity';

/**
 * Abstract repository definition for User operations.
 *
 * Defines the contract for persistence operations related to users.
 */
export abstract class UserRepository {
  /**
   * Persists a new user.
   *
   * @param user - The user entity to create.
   * @returns A promise that resolves to the created UserEntity.
   */
  abstract create(user: UserEntity): Promise<UserEntity>;

  /**
   * Finds a user by their email address.
   *
   * @param email - The email to search for.
   * @returns A promise that resolves to the UserEntity if found, or null otherwise.
   */
  abstract findByEmail(email: string): Promise<UserEntity | null>;

  /**
   * Finds a user by their unique ID.
   *
   * @param id - The ID to search for.
   * @returns A promise that resolves to the UserEntity if found, or null otherwise.
   */
  abstract findById(id: string): Promise<UserEntity | null>;

  /**
   * Updates an existing user.
   *
   * @param user - The user entity with updated values.
   * @returns A promise that resolves to the updated UserEntity.
   */
  abstract update(user: UserEntity): Promise<UserEntity>;

  /**
   * Finds a user by their username.
   *
   * @param userName - The username to search for.
   * @returns A promise that resolves to the UserEntity if found, or null otherwise.
   */
  abstract findByUserName(userName: string): Promise<UserEntity | null>;
}
