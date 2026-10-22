export class FormatterRegistry {
  constructor() {
    this.formatters = new Map();
  }

  register(name, formatter) {
    this.formatters.set(name, formatter);
  }

  get(name) {
    const formatter = this.formatters.get(name);
    if (!formatter) {
      throw new Error(`Format non supporté: ${name}`);
    }
    return formatter;
  }
}