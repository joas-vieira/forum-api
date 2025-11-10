import { Slug } from '../slug.value-object.js';

test('it should be able to create a slug', () => {
  const slug = Slug.createFromText('Hello World!');

  expect(slug.value).toBe('hello-world');
});
