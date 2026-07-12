import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test, expect } from 'vitest';
import { ExcelReporter } from '../../src/reporter/ExcelReporter.js';
import { MemoryTraceStorage } from '../../src/trace/MemoryTraceStorage.js';

test('ExcelReporter can be instantiated', () => {
  const reporter = new ExcelReporter();
  expect(reporter).toBeInstanceOf(ExcelReporter);
});

test('ExcelReporter writes an xlsx file on end', async () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'playwright-excel-'));
  const outputFile = join(tempDir, 'report.xlsx');

  try {
    const reporter = new ExcelReporter({ outputFile, storage: new MemoryTraceStorage() });
    await reporter.onBegin({ projects: [{ name: 'chromium' }] } as never, { titlePath: () => ['root', 'suite'] } as never);
    await reporter.onTestBegin({ title: 'sample' } as never, { status: 'running', duration: 0, errors: [], steps: [], attachments: [] } as never);
    await reporter.onTestEnd({ title: 'sample' } as never, { status: 'passed', duration: 10, errors: [], steps: [], attachments: [] } as never);
    await reporter.onEnd({ status: 'passed', startTime: new Date(), duration: 10 } as never);

    expect(existsSync(outputFile)).toBeTruthy();
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test('ExcelReporter emits TraceRecords for each lifecycle event', async () => {
  const storage = new MemoryTraceStorage();
  const reporter = new ExcelReporter({ storage });

  await reporter.onBegin({ projects: [{ name: 'chromium' }] } as never, { titlePath: () => ['root', 'suite'] } as never);
  await reporter.onTestBegin({ title: 'sample test' } as never, { status: 'running', duration: 0, errors: [], steps: [], attachments: [] } as never);
  await reporter.onTestEnd({ title: 'sample test' } as never, { status: 'passed', duration: 123, errors: [], steps: [], attachments: [] } as never);
  await reporter.onEnd({ status: 'passed', startTime: new Date(), duration: 123 } as never);

  const records = await storage.getTraceRecords();
  // onBegin + onTestBegin + onTestEnd + onEnd = 4 records
  expect(records.length).toBeGreaterThanOrEqual(4);

  const testRecord = records.find((r) => r.testTitle === 'sample test' && r.testStatus === 'passed');
  expect(testRecord).toBeDefined();
  expect(testRecord?.durationMs).toBe(123);
});

test('ExcelReporter keeps each test TraceRecord isolated', async () => {
  const storage = new MemoryTraceStorage();
  const reporter = new ExcelReporter({ storage });

  await reporter.onBegin({ projects: [{ name: 'chromium' }] } as never, { titlePath: () => ['root', 'suite'] } as never);

  await reporter.onTestBegin({ id: 'test-1', title: 'first test' } as never, { status: 'running', duration: 0, errors: [], steps: [], attachments: [], workerIndex: 0, parallelIndex: 0, startTime: new Date(), retry: 0, stderr: [], stdout: [], annotations: [] } as never);
  await reporter.onTestBegin({ id: 'test-2', title: 'second test' } as never, { status: 'running', duration: 0, errors: [], steps: [], attachments: [], workerIndex: 1, parallelIndex: 1, startTime: new Date(), retry: 0, stderr: [], stdout: [], annotations: [] } as never);

  await reporter.onTestEnd({ id: 'test-1', title: 'first test' } as never, { status: 'passed', duration: 15, errors: [], steps: [], attachments: [], workerIndex: 0, parallelIndex: 0, startTime: new Date(), retry: 0, stderr: [], stdout: [], annotations: [] } as never);
  await reporter.onTestEnd({ id: 'test-2', title: 'second test' } as never, { status: 'failed', duration: 25, errors: [], steps: [], attachments: [], workerIndex: 1, parallelIndex: 1, startTime: new Date(), retry: 0, stderr: [], stdout: [], annotations: [] } as never);
  await reporter.onEnd({ status: 'passed', startTime: new Date(), duration: 40 } as never);

  const records = await storage.getTraceRecords();
  const completedTests = records.filter(
    (r) => r.eventType === 'test' && r.testStatus && r.testStatus !== '' && r.testTitle,
  );

  const titles = completedTests.map((r) => r.testTitle).sort();
  expect(titles).toContain('first test');
  expect(titles).toContain('second test');

  expect(completedTests.find((r) => r.testTitle === 'first test')?.testStatus).toBe('passed');
  expect(completedTests.find((r) => r.testTitle === 'second test')?.testStatus).toBe('failed');
});

test('ExcelReporter preserves the generated run name on completion', async () => {
  const storage = new MemoryTraceStorage();
  const reporter = new ExcelReporter({ storage });

  await reporter.onBegin({ projects: [{ name: 'chromium' }] } as never, { titlePath: () => ['root', 'suite'] } as never);
  await reporter.onEnd({ status: 'passed', startTime: new Date(), duration: 1 } as never);

  const records = await storage.getTraceRecords();
  const runRecord = records.find((r) => r.runName);
  expect(runRecord?.runName).toBe('root > suite (chromium)');
});
