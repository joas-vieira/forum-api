import { makeAnswerFactory } from '../../../../../../test/factories/make-answer.factory.js';
import { makeQuestionFactory } from '../../../../../../test/factories/make-question.factory.js';
import { InMemoryAnswerAttachmentRepository } from '../../../../../../test/repositories/in-memory-answer-attachment.repository.js';
import { InMemoryAnswerRepository } from '../../../../../../test/repositories/in-memory-answer.repository.js';
import { InMemoryNotificationRepository } from '../../../../../../test/repositories/in-memory-notification.repository.js';
import { InMemoryQuestionAttachmentRepository } from '../../../../../../test/repositories/in-memory-question-attachment.repository.js';
import { InMemoryQuestionRepository } from '../../../../../../test/repositories/in-memory-question.repository.js';
import { SendNotificationUseCase } from '../../use-cases/send-notification.use-case.js';
import { OnAnswerCreatedSubscriber } from '../on-answer-created.subscriber.js';

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;

describe('OnAnswerCreatedSubscriber', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    );

    new OnAnswerCreatedSubscriber(
      inMemoryQuestionRepository,
      sendNotificationUseCase,
    );
  });

  it('should send notification when an answer is created', async () => {
    const sendNotificationExecuteSpy = vi.spyOn(
      sendNotificationUseCase,
      'execute',
    );

    const question = makeQuestionFactory();
    const answer = makeAnswerFactory({
      questionId: question.id,
    });

    await inMemoryQuestionRepository.create(question);
    await inMemoryAnswerRepository.create(answer);

    await vi.waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
