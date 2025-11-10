import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { makeQuestionAttachmentFactory } from '../../../../../../test/factories/make-question-attachment.factory.js';
import { makeQuestionFactory } from '../../../../../../test/factories/make-question.factory.js';
import { InMemoryQuestionAttachmentRepository } from '../../../../../../test/repositories/in-memory-question-attachment.repository.js';
import { InMemoryQuestionRepository } from '../../../../../../test/repositories/in-memory-question.repository.js';
import { DeleteQuestionUseCase } from '../delete-question.use-case.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: DeleteQuestionUseCase;

describe('DeleteQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository);
  });

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestionFactory();

    await inMemoryQuestionRepository.create(newQuestion);

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachmentFactory({
        questionId: newQuestion.id,
        attachmentId: new UniqueId('1'),
      }),
      makeQuestionAttachmentFactory({
        questionId: newQuestion.id,
        attachmentId: new UniqueId('2'),
      }),
    );

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: newQuestion.id.toString(),
    });

    expect(inMemoryQuestionRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question from another author', async () => {
    const newQuestion = makeQuestionFactory({
      authorId: new UniqueId('author-1'),
    });

    await inMemoryQuestionRepository.create(newQuestion);

    const response = await sut.execute({
      authorId: 'author-2',
      questionId: newQuestion.id.toString(),
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
