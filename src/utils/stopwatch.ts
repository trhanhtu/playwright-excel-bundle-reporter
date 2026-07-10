export class Stopwatch {
  private startedAt = Date.now();

  elapsedMs(): number {
    return Date.now() - this.startedAt;
  }
}
