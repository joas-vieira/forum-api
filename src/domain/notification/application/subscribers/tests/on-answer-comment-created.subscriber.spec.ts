import { makeAnswerCommentFactory } from '../../../../../../test/factories/make-answer-comment.factory.js';
import { makeAnswerFactory } from '../../../../../../test/factories/make-answer.factory.js';
import { InMemoryAnswerAttachmentRepository } from '../../../../../../test/repositories/in-memory-answer-attachment.repository.js';
import { InMemoryAnswerCommentRepository } from '../../../../../../test/repositories/in-memory-answer-comment.repository.js';
import { InMemoryAnswerRepository } from '../../../../../../test/repositories/in-memory-answer.repository.js';
import { InMemoryNotificationRepository } from '../../../../../../test/repositories/in-memory-notification.repository.js';
import { SendNotificationUseCase } from '../../use-cases/send-notification.use-case.js';
import { OnAnswerCommentCreatedSubscriber } from '../on-answer-comment-created.subscriber.js';

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;

describe('OnAnswerCommentCreatedSubscriber', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    );
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();

    new OnAnswerCommentCreatedSubscriber(
      inMemoryAnswerRepository,
      sendNotificationUseCase,
    );
  });

  it('should send notification when an answer comment is created', async () => {
    const sendNotificationExecuteSpy = vi.spyOn(
      sendNotificationUseCase,
      'execute',
    );

    const answer = makeAnswerFactory();
    const answerComment = makeAnswerCommentFactory({
      answerId: answer.id,
    });

    await inMemoryAnswerRepository.create(answer);
    await inMemoryAnswerCommentRepository.create(answerComment);

    await vi.waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
