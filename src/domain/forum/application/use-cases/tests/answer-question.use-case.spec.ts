import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { InMemoryAnswerAttachmentRepository } from '../../../../../../test/repositories/in-memory-answer-attachment.repository.js';
import { InMemoryAnswerRepository } from '../../../../../../test/repositories/in-memory-answer.repository.js';
import { AnswerQuestionUseCase } from '../answer-question.use-case.js';

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: AnswerQuestionUseCase;

describe('AnswerQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository);
  });

  it('should be able create an answer', async () => {
    const response = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'This is an answer',
      attachmentsIds: ['1', '2'],
    });

    expect(response.isRight()).toBe(true);
    expect(inMemoryAnswerRepository.items[0]).toEqual(response.value?.answer);
    expect(
      inMemoryAnswerRepository.items[0]?.attachments.getItems(),
    ).toHaveLength(2);
    expect(inMemoryAnswerRepository.items[0]?.attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueId('1') }),
      expect.objectContaining({ attachmentId: new UniqueId('2') }),
    ]);
  });
});
