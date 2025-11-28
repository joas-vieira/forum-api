import { left, right, type Either } from '@/core/either.js';
import { Student } from '../../enterprise/entities/student.entity.js';
import { HashGenerator } from '../cryptography/hash-generator.js';
import { StudentRepository } from '../repositories/student.repository.js';
import { StudentAlreadyExistsError } from './errors/student-already-exists.error.js';
import { Injectable } from '@nestjs/common';

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.studentRepository.findByEmail(email);

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.studentRepository.create(student);

    return right({ student });
  }
}
