import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as XLSX from 'xlsx';
import { test, expect } from 'vitest';
import { WorkbookBuilder } from '../../src/excel/WorkbookBuilder.js';
import { ExcelCompiler } from '../../src/compiler/ExcelCompiler.js';
import { MemoryTraceStorage } from '../../src/trace/MemoryTraceStorage.js';

test('WorkbookBuilder can be instantiated', () => {
  const builder = new WorkbookBuilder();
  expect(builder).toBeInstanceOf(WorkbookBuilder);
});

test('ExcelCompiler exports Home/Data/Attachment sheets', async () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'playwright-excel-workbook-'));
  const outputFile = join(tempDir, 'schema.xlsx');
  const storage = new MemoryTraceStorage();

  // Insert two console trace records
  await storage.appendTraceRecord({
    recordId: 'r-console-1',
    runId: '' as never,
    testId: 'test-1' as never,
    eventType: 'console',
    timestamp: '2026-07-11T00:00:00.000Z',
    consoleId: 'console-1' as never,
    consoleType: 'stdout',
    consoleMessage: 'hello from console 1',
  });
  await storage.appendTraceRecord({
    recordId: 'r-console-2',
    runId: '' as never,
    testId: 'test-2' as never,
    eventType: 'console',
    timestamp: '2026-07-11T00:00:01.000Z',
    consoleId: 'console-2' as never,
    consoleType: 'stderr',
    consoleMessage: 'hello from console 2',
  });

  try {
    const compiler = new ExcelCompiler(storage);
    await compiler.compile({ outputFile });

    expect(existsSync(outputFile)).toBeTruthy();

    const workbook = XLSX.readFile(outputFile);
    expect(workbook.SheetNames).toEqual(['Home', 'Data', 'Attachment']);

    const homeRows = XLSX.utils.sheet_to_json(workbook.Sheets.Home, { header: 1 });
    expect(homeRows[0]).toEqual(['section', 'metric', 'value', 'link']);
    expect(homeRows[1]).toEqual(['Summary', 'Total Tests', 0, '#Data!A1']);
    expect(homeRows[2]).toEqual(['Summary', 'Passed Tests', 0, '#Data!A1']);
    expect(homeRows[3]).toEqual(['Summary', 'Failed Tests', 0, '#Data!A1']);
    expect(homeRows[4]).toEqual(['Summary', 'Timed Out Tests', 0, '#Data!A1']);
    expect(homeRows[5]).toEqual(['Summary', 'Skipped Tests', 0, '#Data!A1']);
    expect(homeRows[6]).toEqual(['Summary', 'Pass Rate', '0%', '#Data!A1']);
    expect(homeRows[7]).toEqual(['Summary', 'Total Duration', '0.00s', '#Data!A1']);
    expect(homeRows[8]).toEqual(['Summary', 'Trace Records', 2, '#Data!A1']);

    const dataRows = XLSX.utils.sheet_to_json(workbook.Sheets.Data, { header: 1 });
    expect(dataRows[0]).toEqual([
      'recordId',
      'runId',
      'testId',
      'eventType',
      'timestamp',
      'durationMs',
      'runName',
      'runStatus',
      'testTitle',
      'testStatus',
      'testFile',
      'testLine',
      'retry',
      'workerIndex',
      'browser',
      'project',
      'actionId',
      'actionName',
      'actionCategory',
      'actionStatus',
      'requestId',
      'method',
      'url',
      'statusCode',
      'resourceType',
      'chunkParentId',
      'chunkType',
      'chunkIndex',
      'chunkCount',
      'content',
      'consoleId',
      'consoleType',
      'consoleMessage',
      'imageId',
      'imagePath',
      'errorName',
      'errorMessage',
      'stack',
    ]);

    // Find console rows in the data sheet
    const console1Row = dataRows.find((row: any) => row[30] === 'console-1');
    expect(console1Row).toBeDefined();
    expect(console1Row?.[32]).toBe('hello from console 1');

    const console2Row = dataRows.find((row: any) => row[30] === 'console-2');
    expect(console2Row).toBeDefined();
    expect(console2Row?.[32]).toBe('hello from console 2');
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
