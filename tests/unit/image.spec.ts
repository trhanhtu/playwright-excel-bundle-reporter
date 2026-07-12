import { test, expect } from 'vitest';
import { MemoryTraceStorage } from '../../src/trace/MemoryTraceStorage.js';

test('MemoryTraceStorage stores image trace records', async () => {
  const storage = new MemoryTraceStorage();
  await storage.appendTraceRecord({
    recordId: 'img-1',
    runId: '' as never,
    testId: 'test-1' as never,
    eventType: 'image',
    timestamp: new Date().toISOString(),
    imagePath: '/path/to/screenshot.png',
  });
  const records = await storage.getTraceRecords();
  expect(records[0]?.imagePath).toBe('/path/to/screenshot.png');
  expect(records[0]?.eventType).toBe('image');
});
