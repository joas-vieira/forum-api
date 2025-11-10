import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { makeAnswerFactory } from '../../../../../../test/factories/make-answer.factory.js';
import { makeQuestionFactory } from '../../../../../../test/factories/make-question.factory.js';
import { InMemoryAnswerRepository } from '../../../../../../test/repositories/in-memory-answer.repository.js';
import { InMemoryQuestionAttachmentRepository } from '../../../../../../test/repositories/in-memory-question-attachment.repository.js';
import { InMemoryQuestionRepository } from '../../../../../../test/repositories/in-memory-question.repository.js';
import { ChooseQuestionBestAnswerUseCase } from '../choose-question-best-answer.use-case.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';
import { InMemoryAnswerAttachmentRepository } from '../../../../../../test/repositories/in-memory-answer-attachment.repository.js';

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('ChooseQuestionBestAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryQuestionRepository,
    );
  });

  it("should be able to choose a question's best answer", async () => {
    const newQuestion = makeQuestionFactory();
    const newAnswer = makeAnswerFactory({
      questionId: newQuestion.id,
    });

    await inMemoryQuestionRepository.create(newQuestion);
    await inMemoryAnswerRepository.create(newAnswer);

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    });

    expect(inMemoryQuestionRepository.items[0]?.bestAnswerId).toEqual(
      newAnswer.id,
    );
  });

  it('should not be able to choose a best answer from another author', async () => {
    const newQuestion = makeQuestionFactory({
      authorId: new UniqueId('author-1'),
    });
    const newAnswer = makeAnswerFactory({
      questionId: newQuestion.id,
    });

    await inMemoryQuestionRepository.create(newQuestion);
    await inMemoryAnswerRepository.create(newAnswer);

    const response = await sut.execute({
      authorId: 'author-2',
      answerId: newAnswer.id.toString(),
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
