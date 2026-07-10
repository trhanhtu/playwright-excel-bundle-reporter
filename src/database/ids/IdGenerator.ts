export class IdGenerator {
  static nextId(): string {
    return 'id-' + Date.now();
  }
}
