import type { TraceRecord } from './TraceRecord.js';

export interface TraceStorage {
  appendTraceRecord(record: TraceRecord): Promise<void>;
  updateTraceRecord(recordId: string, patch: Partial<TraceRecord>): Promise<void>;
  getTraceRecords(): Promise<TraceRecord[]>;
}
