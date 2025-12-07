import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scryptSync,
  type CipherGCM,
  type DecipherGCM,
} from 'node:crypto';

/**
 * Derives a cryptographic key from a secret and a salt using the scrypt algorithm.
 *
 * @param secret - The secret string to derive the key from.
 * @param salt - The salt string used to protect against rainbow table attacks.
 * @param keyLength - The length of the derived key in bytes. Defaults to 32.
 * @returns The derived key as a Buffer.
 */
export function deriveKey(secret: string, salt: string, keyLength = 32): Buffer {
  const saltBuffer = Buffer.from(salt, 'utf8');
  return scryptSync(secret, saltBuffer, keyLength);
}

/**
 * Encrypts a string using the specified key and algorithm.
 *
 * @remarks
 * Generates a random IV for each encryption and includes the authentication tag
 * in the output to ensure integrity (AES-GCM).
 *
 * @param text - The plain text string to encrypt.
 * @param key - The encryption key.
 * @param algorithm - The encryption algorithm to use. Defaults to 'aes-256-gcm'.
 * @param ivLength - The length of the initialization vector. Defaults to 16.
 * @returns The encrypted data in the format `iv.encrypted.authTag`.
 */
export function encryptWithKey(
  text: string,
  key: Buffer,
  algorithm = 'aes-256-gcm',
  ivLength = 16,
): string {
  // Generate random IV for each encryption
  const iv: Buffer = randomBytes(ivLength);

  // Create cipher with algorithm, key, and IV
  const cipher = createCipheriv(algorithm, key, iv) as CipherGCM;

  // Encrypt the text
  let encrypted: string = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Get the authentication tag (only available after final())
  const authTag: Buffer = cipher.getAuthTag();

  // Return in format: iv.encrypted.authTag
  return [iv.toString('hex'), encrypted, authTag.toString('hex')].join('.');
}

/**
 * Decrypts a string that was encrypted using `encryptWithKey`.
 *
 * @param encryptedData - The encrypted string in the format `iv.encrypted.authTag`.
 * @param key - The decryption key.
 * @param algorithm - The encryption algorithm used. Defaults to 'aes-256-gcm'.
 * @returns The decrypted plain text string.
 * @throws {Error} If the encrypted data format is invalid.
 */
export function decryptWithKey(
  encryptedData: string,
  key: Buffer,
  algorithm = 'aes-256-gcm',
): string {
  // Split encrypted data components
  const parts: string[] = encryptedData.split('.');

  if (parts.length !== 3) {
    throw new Error(
      `Invalid encrypted data format. Expected format: iv.encrypted.authTag, got ${parts.length} parts`,
    );
  }

  // Extract IV, encrypted data, and authTag
  const iv: Buffer = Buffer.from(parts[0], 'hex');
  const encrypted: string = parts[1];
  const authTag: Buffer = Buffer.from(parts[2], 'hex');

  // Create decipher with algorithm, key, and IV
  const decipher = createDecipheriv(algorithm, key, iv) as DecipherGCM;

  // Set authentication tag for verification
  decipher.setAuthTag(authTag);

  // Decrypt the text
  let decrypted: string = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Generates a SHA-256 hash of the input text.
 *
 * @param text - The text to hash.
 * @returns The hexadecimal representation of the hash.
 */
export function hash(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}
