import fs from 'node:fs';

export class JsonFileOrderRepository {
  constructor(filePath) {
    this.filePath = filePath;
  }

  all() {
    const raw = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(raw);
  }
}