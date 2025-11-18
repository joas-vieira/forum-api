import { left, right, type Either } from '@/core/either.js';
import { Encrypter } from '../cryptography/encrypter.js';
import { HashComparer } from '../cryptography/hash-comparer.js';
import { StudentRepository } from '../repositories/student.repository.js';
import { InvalidCredentialsError } from './errors/invalid-credentials.error.js';
import { StudentAlreadyExistsError } from './errors/student-already-exists.error.js';

interface AuthenticateStudentUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    accessToken: string;
  }
>;

export class AuthenticateStudentUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentRepository.findByEmail(email);

    if (!student) return left(new InvalidCredentialsError());

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    );

    if (!isPasswordValid) return left(new InvalidCredentialsError());

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ accessToken });
  }
}
