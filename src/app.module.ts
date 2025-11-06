import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateAccountController } from './controllers/create-account.controller';
import { envSchema } from './env';
import { PrismaService } from './prisma/prisma.service';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthModule } from './auth/auth.module';
import { CreateQuestionController } from './controllers/create-question.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
