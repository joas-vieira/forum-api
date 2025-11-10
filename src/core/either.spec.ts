import { left, right, type Either } from './either.js';

function doSomething(shouldSuccess: boolean): Either<string, string> {
  return shouldSuccess ? right('Success') : left('Error');
}

describe('Either', () => {
  it('should return success result', () => {
    const result = doSomething(true);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
  });

  it('should return error result', () => {
    const result = doSomething(false);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
  });
});
