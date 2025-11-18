/* eslint-disable @typescript-eslint/no-explicit-any */

import { Provider } from '@nestjs/common';

type Constructor<T = unknown> = new (...args: any[]) => T;
type AbstractConstructor<T = unknown> = abstract new (...args: any[]) => T;
type AnyConstructor<T = unknown> = Constructor<T> | AbstractConstructor<T>;

export function makeUseCaseProvider<T>(
  useCase: Constructor<T>,
  dependencies: AnyConstructor[],
): Provider {
  return {
    provide: useCase,
    useFactory: (...deps: any[]) => {
      return new useCase(...deps);
    },
    inject: dependencies,
  };
}
