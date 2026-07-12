import type { TraceRecord } from './TraceRecord.js';
import type { TraceStorage } from './TraceStorage.js';
import { createEmptyTraceRecord } from './TraceRecord.js';

export class MemoryTraceStorage implements TraceStorage {
  private readonly records: TraceRecord[] = [];

  public async appendTraceRecord(record: TraceRecord): Promise<void> {
    this.records.push({ ...createEmptyTraceRecord(), ...record });
  }

  public async updateTraceRecord(
    recordId: string,
    patch: Partial<TraceRecord>,
  ): Promise<void> {
    const index = this.records.findIndex((r) => r.recordId === recordId);
    if (index >= 0 && this.records[index]) {
      Object.assign(this.records[index], patch);
    }
  }

  public async getTraceRecords(): Promise<TraceRecord[]> {
    return [...this.records];
  }
}
