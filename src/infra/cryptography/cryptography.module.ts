import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HashComparer, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
