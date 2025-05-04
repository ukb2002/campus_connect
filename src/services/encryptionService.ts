
import CryptoJS from "crypto-js";

/**
 * Encrypts a message using AES encryption
 * @param message The message to encrypt
 * @param key The encryption key
 * @returns The encrypted message
 */
export const encryptMessage = (message: string, key: string): string => {
  try {
    return CryptoJS.AES.encrypt(message, key).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt message");
  }
};

/**
 * Decrypts a message using AES encryption
 * @param encryptedMessage The encrypted message
 * @param key The encryption key
 * @returns The decrypted message
 */
export const decryptMessage = (encryptedMessage: string, key: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return "[Unable to decrypt message]";
  }
};

/**
 * Generate a random encryption key
 * @param length The length of the key
 * @returns A random encryption key
 */
export const generateEncryptionKey = (length: number = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};
