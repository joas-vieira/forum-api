import { DomainEvents } from '@/core/events/domain-events.js';
import type { EventHandler } from '@/core/events/event-handler.js';
import type { QuestionRepository } from '@/domain/forum/application/repositories/question.repository.js';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created.event.js';
import type { SendNotificationUseCase } from '../use-cases/send-notification.use-case.js';

export class OnAnswerCreatedSubscriber implements EventHandler {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta na sua pergunta "${question.title}"`,
        content: answer.excerpt,
      });
    }
  }
}
