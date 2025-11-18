import { FakeHasher } from '@test/cryptography/fake-hasher.js';
import { InMemoryStudentRepository } from '@test/repositories/in-memory-student.repository.js';
import { RegisterStudentUseCase } from '../register-student.use-case.js';

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('RegisterStudentUseCase', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakeHasher);
  });

  it('should be able register a student', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    });
  });

  it('should hash the student password upon registration', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(response.isRight()).toBe(true);
    expect(inMemoryStudentRepository.items[0].password).toEqual(hashedPassword);
  });
});
