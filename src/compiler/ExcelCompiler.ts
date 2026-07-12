import { WorkbookBuilder, type WorkbookRow } from '../excel/WorkbookBuilder.js';
import type { TraceRecord } from '../trace/TraceRecord.js';
import type { TraceStorage } from '../trace/TraceStorage.js';

type SheetDefinition = {
  name: string;
  columns: string[];
  rows: WorkbookRow[];
  autoFilter?: boolean;
  freezeHeader?: boolean;
};

export interface ExcelCompilerOptions {
  outputFile: string;
}

export class ExcelCompiler {
  constructor(private readonly storage: TraceStorage) {}

  public async compile(options: ExcelCompilerOptions): Promise<void> {
    const records = await this.storage.getTraceRecords();
    const builder = new WorkbookBuilder();

    for (const sheet of this.buildSheets(records)) {
      builder.addSheet(sheet.name, sheet.rows, sheet.columns, {
        ...(sheet.autoFilter !== undefined && { autoFilter: sheet.autoFilter }),
        ...(sheet.freezeHeader !== undefined && { freezeHeader: sheet.freezeHeader }),
      });
    }

    builder.save(options.outputFile);
  }

  private buildSheets(records: TraceRecord[]): SheetDefinition[] {
    return [
      this.buildHomeSheet(records),
      this.buildDataSheet(records),
      this.buildAttachmentSheet(records),
    ];
  }

  private buildHomeSheet(records: TraceRecord[]): SheetDefinition {
    const testStatuses = new Map<string, string>();
    let totalDurationMs = 0;

    for (const r of records) {
      if (r.eventType === 'test' && r.testId) {
        if (r.testStatus) {
          testStatuses.set(r.testId, r.testStatus);
        }
        if (r.durationMs) {
          totalDurationMs += r.durationMs;
        }
      }
    }

    const totalTests = testStatuses.size;
    let passed = 0;
    let failed = 0;
    let timedOut = 0;
    let skipped = 0;

    for (const status of testStatuses.values()) {
      if (status === 'passed') passed++;
      else if (status === 'failed') failed++;
      else if (status === 'timedOut' || status === 'timedout') timedOut++;
      else if (status === 'skipped') skipped++;
    }

    const passRate = totalTests > 0 ? `${Math.round((passed / totalTests) * 100)}%` : '0%';

    return this.createSheet(
      'Home',
      ['section', 'metric', 'value', 'link'],
      [
        { section: 'Summary', metric: 'Total Tests', value: totalTests, link: '#Data!A1' },
        { section: 'Summary', metric: 'Passed Tests', value: passed, link: '#Data!A1' },
        { section: 'Summary', metric: 'Failed Tests', value: failed, link: '#Data!A1' },
        { section: 'Summary', metric: 'Timed Out Tests', value: timedOut, link: '#Data!A1' },
        { section: 'Summary', metric: 'Skipped Tests', value: skipped, link: '#Data!A1' },
        { section: 'Summary', metric: 'Pass Rate', value: passRate, link: '#Data!A1' },
        {
          section: 'Summary',
          metric: 'Total Duration',
          value: `${(totalDurationMs / 1000).toFixed(2)}s`,
          link: '#Data!A1',
        },
        { section: 'Summary', metric: 'Trace Records', value: records.length, link: '#Data!A1' },
        { section: 'Navigation', metric: 'Data', value: 'Open flat event log', link: '#Data!A1' },
        {
          section: 'Navigation',
          metric: 'Attachment',
          value: 'Open large payloads and images',
          link: '#Attachment!A1',
        },
      ],
    );
  }

  private buildDataSheet(records: TraceRecord[]): SheetDefinition {
    return {
      ...this.createSheet(
        'Data',
        this.traceColumns(),
        records.map((r) => this.toTraceRow(r)),
      ),
      autoFilter: true,
      freezeHeader: true,
    };
  }

  private buildAttachmentSheet(records: TraceRecord[]): SheetDefinition {
    const attachmentRows = records.filter(
      (r) => Boolean(r.content) || Boolean(r.imagePath),
    );

    return {
      ...this.createSheet(
        'Attachment',
        [
          'recordId',
          'eventType',
          'testId',
          'requestId',
          'chunkParentId',
          'chunkType',
          'chunkIndex',
          'chunkCount',
          'content',
          'imageId',
          'imagePath',
        ],
        attachmentRows.map((r) => ({
          recordId: r.recordId,
          eventType: r.eventType,
          testId: r.testId,
          requestId: r.requestId,
          chunkParentId: r.chunkParentId,
          chunkType: r.chunkType,
          chunkIndex: r.chunkIndex,
          chunkCount: r.chunkCount,
          content: r.content,
          imageId: r.imageId,
          imagePath: r.imagePath,
        })),
      ),
      autoFilter: true,
      freezeHeader: true,
    };
  }

  private createSheet(name: string, columns: string[], rows: WorkbookRow[]): SheetDefinition {
    return { name, columns, rows };
  }

  private traceColumns(): string[] {
    return [
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
    ];
  }

  private toTraceRow(record: TraceRecord): WorkbookRow {
    return { ...record };
  }
}
