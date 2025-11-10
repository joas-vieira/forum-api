import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { makeQuestionAttachmentFactory } from '../../../../../../test/factories/make-question-attachment.factory.js';
import { makeQuestionFactory } from '../../../../../../test/factories/make-question.factory.js';
import { InMemoryQuestionAttachmentRepository } from '../../../../../../test/repositories/in-memory-question-attachment.repository.js';
import { InMemoryQuestionRepository } from '../../../../../../test/repositories/in-memory-question.repository.js';
import { EditQuestionUseCase } from '../edit-question.use-case.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: EditQuestionUseCase;

describe('EditQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    sut = new EditQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionAttachmentRepository,
    );
  });

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestionFactory(
      {
        authorId: new UniqueId('author-1'),
      },
      new UniqueId('question-1'),
    );

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
      authorId: 'author-1',
      questionId: 'question-1',
      title: 'Edited Question',
      content: 'Edited Content',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: 'Edited Question',
      content: 'Edited Content',
    });
    expect(
      inMemoryQuestionRepository.items[0]?.attachments.getItems(),
    ).toHaveLength(2);
    expect(inMemoryQuestionRepository.items[0]?.attachments.getItems()).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueId('1') }),
        expect.objectContaining({ attachmentId: new UniqueId('3') }),
      ],
    );
  });

  it('should not be able to edit a question from another author', async () => {
    const newQuestion = makeQuestionFactory(
      {
        authorId: new UniqueId('author-1'),
      },
      new UniqueId('question-1'),
    );

    await inMemoryQuestionRepository.create(newQuestion);

    const response = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
      title: 'Edited Question',
      content: 'Edited Content',
      attachmentsIds: [],
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
