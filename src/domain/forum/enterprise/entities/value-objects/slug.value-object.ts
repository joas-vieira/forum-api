export class Slug {
  value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    return new Slug(value);
  }

  static createFromText(value: string) {
    const slug = value
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');

    return new Slug(slug);
  }
}
