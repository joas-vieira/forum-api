import type { UseCaseError } from '@/core/errors/use-case-error.js';

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed');
  }
}
