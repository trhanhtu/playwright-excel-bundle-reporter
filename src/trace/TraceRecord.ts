import type { ActionId, ConsoleId, ImageId, RequestId, RunId, TestId } from '../types/ids.js';
export type { ActionId, ConsoleId, ImageId, RequestId, RunId, TestId };

export type RunRecordStatus =
  | 'passed'
  | 'failed'
  | 'timedOut'
  | 'timedout'
  | 'skipped'
  | 'interrupted'
  | 'running'
  | '';

export type ActionStatus = 'running' | 'completed' | 'failed' | 'skipped';

export type ActionCategory =
  | 'hook'
  | 'fixture'
  | 'pw:api'
  | 'test.step'
  | (string & {});

export type TraceEventType =
  | 'test'
  | 'action'
  | 'request'
  | 'response'
  | 'console'
  | 'image'
  | 'error';

export type ChunkType =
  | 'request-header'
  | 'request-body'
  | 'response-header'
  | 'response-body'
  | 'console'
  | 'stack';

export interface TraceRecord {
  // Identity
  recordId: string;
  runId: RunId;
  testId: TestId;

  // Event
  eventType: TraceEventType;
  timestamp: string;
  durationMs?: number | undefined;

  // Run
  runName?: string | undefined;
  runStatus?: RunRecordStatus | undefined;

  // Test
  testTitle?: string | undefined;
  testStatus?: RunRecordStatus | undefined;
  testFile?: string | undefined;
  testLine?: number | undefined;
  retry?: number | undefined;
  workerIndex?: number | undefined;
  browser?: string | undefined;
  project?: string | undefined;

  // Action
  actionId?: ActionId | undefined;
  actionName?: string | undefined;
  actionCategory?: ActionCategory | undefined;
  actionStatus?: ActionStatus | undefined;

  // Network
  requestId?: RequestId | undefined;
  method?: string | undefined;
  url?: string | undefined;
  statusCode?: number | undefined;
  resourceType?: string | undefined;

  // Chunked content
  chunkParentId?: string | undefined;
  chunkType?: ChunkType | undefined;
  chunkIndex?: number | undefined;
  chunkCount?: number | undefined;
  content?: string | undefined;

  // Console
  consoleId?: ConsoleId | undefined;
  consoleType?: string | undefined;
  consoleMessage?: string | undefined;

  // Attachment
  imageId?: ImageId | undefined;
  imagePath?: string | undefined;

  // Error
  errorName?: string | undefined;
  errorMessage?: string | undefined;
  stack?: string | undefined;
}

export function createEmptyTraceRecord(): TraceRecord {
  return {
    recordId: '',
    runId: '' as RunId,
    testId: '' as TestId,
    eventType: 'test',
    timestamp: '',
  };
}
