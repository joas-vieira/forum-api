import { randomUUID } from 'node:crypto';

export class UniqueId {
  private value: string;

  toString(): string {
    return this.value;
  }

  toValue(): string {
    return this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  public equals(id: UniqueId) {
    return id.toValue() === this.value;
  }
}
