import { DomainEvents } from '@/core/events/domain-events.js';
import type { EventHandler } from '@/core/events/event-handler.js';
import type { AnswerRepository } from '@/domain/forum/application/repositories/answer.repository.js';
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created.event.js';
import type { SendNotificationUseCase } from '../use-cases/send-notification.use-case.js';

export class OnAnswerCommentCreatedSubscriber implements EventHandler {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    );
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answerRepository.findById(
      answerComment.answerId.toString(),
    );

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: `Novo comentário na sua resposta`,
        content: answerComment.content,
      });
    }
  }
}
