import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util'

const scryptAsync = promisify(scrypt);


export const hashText = async (plainText: string) => {
  const salt = randomBytes(8).toString('hex')
  const buffer = await scryptAsync(plainText, salt, 64) as Buffer
  return `${buffer.toString('hex')}.${salt}`
};

export const compareHash = async (plainText: string, hashedText: string) => {
  const [savedHash, salt] = hashedText.split('.');
  const buffer = await scryptAsync(plainText, salt, 64) as Buffer
  return buffer.toString('hex') === savedHash
}


