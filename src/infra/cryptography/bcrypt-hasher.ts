import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { compare, hash } from 'bcrypt';

export class BcryptHasher implements HashGenerator, HashComparer {
  async hash(plainText: string): Promise<string> {
    const PASSWORD_SALT = 8;

    return hash(plainText, PASSWORD_SALT);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return compare(plainText, hash);
  }
}
