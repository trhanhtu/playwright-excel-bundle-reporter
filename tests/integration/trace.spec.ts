import { test, expect } from 'vitest';
import { MemoryTraceStorage } from '../../src/trace/MemoryTraceStorage.js';
import { createEmptyTraceRecord } from '../../src/trace/TraceRecord.js';

test('MemoryTraceStorage can be instantiated', () => {
  const storage = new MemoryTraceStorage();
  expect(storage).toBeInstanceOf(MemoryTraceStorage);
});

test('MemoryTraceStorage appends and retrieves TraceRecords', async () => {
  const storage = new MemoryTraceStorage();
  const record = { ...createEmptyTraceRecord(), recordId: 'r1', timestamp: '2026-01-01T00:00:00Z' };
  await storage.appendTraceRecord(record);
  const records = await storage.getTraceRecords();
  expect(records).toHaveLength(1);
  expect(records[0]?.recordId).toBe('r1');
});

test('MemoryTraceStorage updates an existing TraceRecord', async () => {
  const storage = new MemoryTraceStorage();
  const record = { ...createEmptyTraceRecord(), recordId: 'r2', actionStatus: 'running' as const, timestamp: '2026-01-01T00:00:00Z' };
  await storage.appendTraceRecord(record);
  await storage.updateTraceRecord('r2', { actionStatus: 'completed' });
  const records = await storage.getTraceRecords();
  expect(records[0]?.actionStatus).toBe('completed');
});
