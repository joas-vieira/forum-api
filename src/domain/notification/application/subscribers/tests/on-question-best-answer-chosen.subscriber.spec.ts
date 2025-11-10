import { makeAnswerFactory } from '../../../../../../test/factories/make-answer.factory.js';
import { makeQuestionFactory } from '../../../../../../test/factories/make-question.factory.js';
import { InMemoryAnswerAttachmentRepository } from '../../../../../../test/repositories/in-memory-answer-attachment.repository.js';
import { InMemoryAnswerRepository } from '../../../../../../test/repositories/in-memory-answer.repository.js';
import { InMemoryNotificationRepository } from '../../../../../../test/repositories/in-memory-notification.repository.js';
import { InMemoryQuestionAttachmentRepository } from '../../../../../../test/repositories/in-memory-question-attachment.repository.js';
import { InMemoryQuestionRepository } from '../../../../../../test/repositories/in-memory-question.repository.js';
import { SendNotificationUseCase } from '../../use-cases/send-notification.use-case.js';
import { OnQuestionBestAnswerChosenSubscriber } from '../on-question-best-answer-chosen.subscriber.js';

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;

describe('OnQuestionBestAnswerChosenSubscriber', () => {
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

    new OnQuestionBestAnswerChosenSubscriber(
      inMemoryAnswerRepository,
      sendNotificationUseCase,
    );
  });

  it('should send notification when a best answer is chosen for a question', async () => {
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

    question.bestAnswerId = answer.id;

    await inMemoryQuestionRepository.save(question);

    await vi.waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
