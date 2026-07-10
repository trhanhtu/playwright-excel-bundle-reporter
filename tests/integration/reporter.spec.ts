import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test, expect } from "vitest";
import { ExcelReporter } from '../../src/reporter/ExcelReporter.js';
import { MemoryStorage } from '../../src/storage/memory/MemoryStorage.js';
import { SqliteStorage } from '../../src/storage/sqlite/SqliteStorage.js';

test('ExcelReporter can be instantiated', () => {
  const reporter = new ExcelReporter(new SqliteStorage('memory'));
  expect(reporter).toBeInstanceOf(ExcelReporter);
});

test('ExcelReporter writes an xlsx file on end', async () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'playwright-excel-'));
  const outputFile = join(tempDir, 'report.xlsx');

  try {
    const reporter = new ExcelReporter({ outputFile, storage: new MemoryStorage() });
    await reporter.onBegin();
    await reporter.onTestBegin('sample');
    await reporter.onTestEnd('sample', 'passed');
    await reporter.onEnd();

    expect(existsSync(outputFile)).toBeTruthy();
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
