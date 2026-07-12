import { test, expect } from 'vitest';
import { createEmptyTraceRecord } from '../../src/trace/TraceRecord.js';

test('createEmptyTraceRecord returns a default TraceRecord', () => {
  const record = createEmptyTraceRecord();
  expect(record.recordId).toBe('');
  expect(record.eventType).toBe('test');
  expect(record.timestamp).toBe('');
});
