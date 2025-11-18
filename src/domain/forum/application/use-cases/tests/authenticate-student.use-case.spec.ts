import { FakeEncrypter } from '@test/cryptography/fake-encrypter';
import { FakeHasher } from '@test/cryptography/fake-hasher.js';
import { makeStudentFactory } from '@test/factories/make-student.factory';
import { InMemoryStudentRepository } from '@test/repositories/in-memory-student.repository.js';
import { AuthenticateStudentUseCase } from '../authenticate-student.use-case';

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe('AuthenticateStudentUseCase', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a student', async () => {
    const student = makeStudentFactory({
      email: 'john.doe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    await inMemoryStudentRepository.create(student);

    const response = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    });

    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
