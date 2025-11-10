import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { makeAnswerFactory } from '../../../../../../test/factories/make-answer.factory.js';
import { InMemoryAnswerAttachmentRepository } from '../../../../../../test/repositories/in-memory-answer-attachment.repository.js';
import { InMemoryAnswerRepository } from '../../../../../../test/repositories/in-memory-answer.repository.js';
import { EditAnswerUseCase } from '../edit-answer.use-case.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';
import { makeAnswerAttachmentFactory } from '../../../../../../test/factories/make-answer-attachment.factory.js';

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: EditAnswerUseCase;

describe('EditAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    sut = new EditAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentRepository,
    );
  });

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswerFactory(
      {
        authorId: new UniqueId('author-1'),
      },
      new UniqueId('answer-1'),
    );

    await inMemoryAnswerRepository.create(newAnswer);

    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachmentFactory({
        answerId: newAnswer.id,
        attachmentId: new UniqueId('1'),
      }),
      makeAnswerAttachmentFactory({
        answerId: newAnswer.id,
        attachmentId: new UniqueId('2'),
      }),
    );

    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'Edited Content',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: 'Edited Content',
    });
    expect(
      inMemoryAnswerRepository.items[0]?.attachments.getItems(),
    ).toHaveLength(2);
    expect(inMemoryAnswerRepository.items[0]?.attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueId('1') }),
      expect.objectContaining({ attachmentId: new UniqueId('3') }),
    ]);
  });

  it('should not be able to edit a answer from another author', async () => {
    const newAnswer = makeAnswerFactory(
      {
        authorId: new UniqueId('author-1'),
      },
      new UniqueId('answer-1'),
    );

    await inMemoryAnswerRepository.create(newAnswer);

    const response = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
      content: 'Edited Content',
      attachmentsIds: [],
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
