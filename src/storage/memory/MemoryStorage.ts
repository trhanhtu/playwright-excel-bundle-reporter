import type {
  ActionRecord,
  BodyChunkRecord,
  ConsoleRecord,
  HeaderRecord,
  ImageRecord,
  MetadataRecord,
  RequestRecord,
  RunRecord,
  Storage,
  TestRecord,
} from '../Storage.js';

export class MemoryStorage implements Storage {
  private readonly runs: RunRecord[] = [];
  private readonly tests: TestRecord[] = [];
  private readonly actions: ActionRecord[] = [];
  private readonly requests: RequestRecord[] = [];
  private readonly headers: HeaderRecord[] = [];
  private readonly bodyChunks: BodyChunkRecord[] = [];
  private readonly consoleEntries: ConsoleRecord[] = [];
  private readonly images: ImageRecord[] = [];
  private readonly metadata: MetadataRecord[] = [];

  public async insertRun(run: RunRecord): Promise<void> {
    this.runs.push(run);
  }

  public async insertTest(test: TestRecord): Promise<void> {
    this.tests.push(test);
  }

  public async updateTest(test: TestRecord): Promise<void> {
    const index = this.tests.findIndex((item) => item.id === test.id);
    if (index >= 0) {
      this.tests[index] = test;
    } else {
      this.tests.push(test);
    }
  }

  public async insertAction(action: ActionRecord): Promise<void> {
    this.actions.push(action);
  }

  public async insertRequest(request: RequestRecord): Promise<void> {
    this.requests.push(request);
  }

  public async insertHeader(header: HeaderRecord): Promise<void> {
    this.headers.push(header);
  }

  public async insertBodyChunk(chunk: BodyChunkRecord): Promise<void> {
    this.bodyChunks.push(chunk);
  }

  public async insertConsole(entry: ConsoleRecord): Promise<void> {
    this.consoleEntries.push(entry);
  }

  public async insertImage(image: ImageRecord): Promise<void> {
    this.images.push(image);
  }

  public async insertMetadata(metadata: MetadataRecord): Promise<void> {
    this.metadata.push(metadata);
  }

  public async close(): Promise<void> {
    // no-op for in-memory storage
  }
}
