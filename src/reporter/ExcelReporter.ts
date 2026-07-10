import type { Storage, RunRecord, TestRecord, ActionRecord, RequestRecord, HeaderRecord, BodyChunkRecord, ConsoleRecord, ImageRecord, MetadataRecord } from '../storage/Storage.js';
import { randomUUID } from 'node:crypto';
import type { ReporterOptions } from './ReporterOptions.js';
import { MemoryStorage } from '../storage/memory/MemoryStorage.js';

export class ExcelReporter {
  private currentRunId: string | undefined;
  private currentTestId: string | undefined;
  private readonly storage: Storage;

  constructor(options?: ReporterOptions | Storage) {
    if (options && typeof options === 'object' && 'insertRun' in options) {
      this.storage = options;
      return;
    }

    const reporterOptions = options as ReporterOptions | undefined;
    this.storage = reporterOptions?.storage ?? new MemoryStorage();
  }

  public async onBegin(): Promise<void> {
    this.currentRunId = randomUUID();
    await this.storage.insertRun({
      id: this.currentRunId,
      name: 'playwright-run',
      status: 'running',
      startedAt: new Date().toISOString(),
    });
  }

  public async onTestBegin(title: string): Promise<void> {
    this.currentTestId = randomUUID();
    await this.storage.insertTest({
      id: this.currentTestId,
      runId: this.currentRunId ?? randomUUID(),
      title,
      status: 'running',
      durationMs: 0,
    });
  }

  public async onTestEnd(title: string, status: string): Promise<void> {
    if (!this.currentTestId) {
      return;
    }

    await this.storage.updateTest({
      id: this.currentTestId,
      runId: this.currentRunId ?? randomUUID(),
      title,
      status,
      durationMs: 0,
    });
  }

  public async onAction(name: string): Promise<void> {
    if (!this.currentTestId) {
      return;
    }

    await this.storage.insertAction({
      id: randomUUID(),
      testId: this.currentTestId,
      name,
      status: 'pending',
    });
  }

  public async onRequest(request: RequestRecord): Promise<void> {
    await this.storage.insertRequest(request);
  }

  public async onHeader(header: HeaderRecord): Promise<void> {
    await this.storage.insertHeader(header);
  }

  public async onBodyChunk(chunk: BodyChunkRecord): Promise<void> {
    await this.storage.insertBodyChunk(chunk);
  }

  public async onConsole(entry: ConsoleRecord): Promise<void> {
    await this.storage.insertConsole(entry);
  }

  public async onImage(image: ImageRecord): Promise<void> {
    await this.storage.insertImage(image);
  }

  public async onMetadata(metadata: MetadataRecord): Promise<void> {
    await this.storage.insertMetadata(metadata);
  }

  public async onEnd(): Promise<void> {
    if (!this.currentRunId) {
      return;
    }

    await this.storage.insertRun({
      id: this.currentRunId,
      name: 'playwright-run',
      status: 'completed',
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
    });
    await this.storage.close();
  }
}
