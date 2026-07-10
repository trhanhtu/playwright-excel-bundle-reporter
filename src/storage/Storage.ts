export interface RunRecord {
  id: string;
  name: string;
  status: string;
  startedAt: string;
  finishedAt?: string;
  outputFile?: string;
}

export interface TestRecord {
  id: string;
  runId: string;
  title: string;
  status: string;
  durationMs: number;
  browser?: string;
  project?: string;
  tags?: string[];
  startedAt?: string;
  finishedAt?: string;
}

export interface ActionRecord {
  id: string;
  testId: string;
  name: string;
  status?: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface RequestRecord {
  id: string;
  actionId: string;
  method?: string;
  url?: string;
}

export interface HeaderRecord {
  id: string;
  requestId: string;
  name: string;
  value: string;
}

export interface BodyChunkRecord {
  id: string;
  requestId: string;
  chunk: string;
  order: number;
}

export interface ConsoleRecord {
  id: string;
  testId: string;
  message: string;
  type?: string;
  timestamp?: string;
}

export interface ImageRecord {
  id: string;
  testId: string;
  path: string;
  mimeType?: string;
}

export interface MetadataRecord {
  id: string;
  testId: string;
  key: string;
  value: string;
}

export interface Storage {
  insertRun(run: RunRecord): Promise<void>;
  updateRun(run: RunRecord): Promise<void>;
  getRuns(): Promise<RunRecord[]>;
  insertTest(test: TestRecord): Promise<void>;
  updateTest(test: TestRecord): Promise<void>;
  getTests(): Promise<TestRecord[]>;
  insertAction(action: ActionRecord): Promise<void>;
  getActions(): Promise<ActionRecord[]>;
  insertRequest(request: RequestRecord): Promise<void>;
  getRequests(): Promise<RequestRecord[]>;
  insertHeader(header: HeaderRecord): Promise<void>;
  getHeaders(): Promise<HeaderRecord[]>;
  insertBodyChunk(chunk: BodyChunkRecord): Promise<void>;
  getBodyChunks(): Promise<BodyChunkRecord[]>;
  insertConsole(entry: ConsoleRecord): Promise<void>;
  getConsoleEntries(): Promise<ConsoleRecord[]>;
  insertImage(image: ImageRecord): Promise<void>;
  getImages(): Promise<ImageRecord[]>;
  insertMetadata(metadata: MetadataRecord): Promise<void>;
  getMetadata(): Promise<MetadataRecord[]>;
  close(): Promise<void>;
}
