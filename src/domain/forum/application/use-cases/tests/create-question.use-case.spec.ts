import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { InMemoryQuestionAttachmentRepository } from '../../../../../../test/repositories/in-memory-question-attachment.repository.js';
import { InMemoryQuestionRepository } from '../../../../../../test/repositories/in-memory-question.repository.js';
import { CreateQuestionUseCase } from '../create-question.use-case.js';

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: CreateQuestionUseCase;

describe('CreateQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    sut = new CreateQuestionUseCase(inMemoryQuestionRepository);
  });

  it('should be able create a question', async () => {
    const response = await sut.execute({
      authorId: '1',
      title: 'This is a question',
      content: 'This is the content of the question',
      attachmentsIds: ['1', '2'],
    });

    expect(response.isRight()).toBe(true);
    expect(inMemoryQuestionRepository.items[0]).toEqual(
      response.value?.question,
    );
    expect(
      inMemoryQuestionRepository.items[0]?.attachments.getItems(),
    ).toHaveLength(2);
    expect(inMemoryQuestionRepository.items[0]?.attachments.getItems()).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueId('1') }),
        expect.objectContaining({ attachmentId: new UniqueId('2') }),
      ],
    );
  });
});
