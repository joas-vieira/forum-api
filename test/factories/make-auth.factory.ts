import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from './make-student.factory';
import { Injectable } from '@nestjs/common';
import { Student } from '@/domain/forum/enterprise/entities/student.entity';

interface MakeTokenResponse {
  user: Student;
  accessToken: string;
}

@Injectable()
export class AuthFactory {
  constructor(
    private readonly jwtService: JwtService,
    private readonly studentFactory: StudentFactory,
  ) {}

  async makeToken(): Promise<MakeTokenResponse> {
    const user = await this.studentFactory.makePrisma();

    const accessToken = this.jwtService.sign({ sub: user.id.toString() });

    return {
      user,
      accessToken,
    };
  }
}
