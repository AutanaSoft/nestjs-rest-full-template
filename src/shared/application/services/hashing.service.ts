/**
 * Abstract class defining the contract for hashing operations.
 * Used for secure password hashing and verification.
 *
 * @public
 */
export abstract class HashingService {
  /**
   * Hashes a string (e.g., a password).
   * @param data - The string to hash.
   * @returns A promise that resolves to the hashed string.
   */
  abstract hash(data: string): Promise<string>;

  /**
   * Compares a plain text string with a hash.
   * @param data - The plain text string.
   * @param encrypted - The hash to compare against.
   * @returns A promise that resolves to true if they match, false otherwise.
   */
  abstract compare(data: string, encrypted: string): Promise<boolean>;
}
