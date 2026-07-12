import type {
  ActionCategory,
  ActionId,
  ConsoleId,
  ImageId,
  RunId,
  TestId,
  TraceRecord,
} from '../trace/TraceRecord.js';
import type { TraceStorage } from '../trace/TraceStorage.js';
import { MemoryTraceStorage } from '../trace/MemoryTraceStorage.js';
import { ExcelCompiler } from '../compiler/ExcelCompiler.js';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestError,
  TestResult,
  TestStep,
  WorkerInfo,
} from '@playwright/test/reporter';
import { generateId } from '../utils/generateUUID.js';

export interface ExcelReporterOptions {
  outputFile?: string;
  storage?: TraceStorage;
}

export class ExcelReporter implements Reporter {
  private currentRunId: RunId | undefined;
  private currentRunName: string | undefined;
  private readonly storage: TraceStorage;
  private readonly outputFile: string | undefined;
  private readonly testStepMap: WeakMap<TestStep, ActionId> = new WeakMap();

  constructor(options?: ExcelReporterOptions) {
    this.storage = options?.storage ?? new MemoryTraceStorage();
    this.outputFile = options?.outputFile;
  }

  public async onBegin(config: FullConfig, suite: Suite): Promise<void> {
    this.currentRunId = generateId<RunId>();
    this.currentRunName =
      suite.titlePath().join(' > ') || suite.title || 'playwright-run';
    if (config.projects?.length) {
      this.currentRunName = `${this.currentRunName} (${config.projects.map((p) => p.name).join(', ')})`;
    }

    const timestamp = new Date().toISOString();
    await this.storage.appendTraceRecord({
      recordId: generateId(),
      runId: this.currentRunId,
      testId: '' as TestId,
      eventType: 'test',
      timestamp,
      runName: this.currentRunName,
      runStatus: 'running',
    });
  }

  public async onTestBegin(test: TestCase, result: TestResult): Promise<void> {
    if (!this.currentRunId) {
      return;
    }
    const testId = this.getTestId(test);
    await this.storage.appendTraceRecord({
      recordId: generateId(),
      runId: this.currentRunId,
      testId,
      eventType: 'test',
      timestamp: result.startTime?.toISOString() ?? new Date().toISOString(),
      testTitle: test.title,
      testStatus: '',
      retry: result.retry,
      workerIndex: result.workerIndex,
      project: test.parent?.project()?.name,
    });
  }

  public async onTestEnd(test: TestCase, result: TestResult): Promise<void> {
    if (!this.currentRunId) {
      return;
    }

    const projectName = test.parent?.project()?.name || 'project name not found';
    const testId = this.getTestId(test);
    const startTime = result.startTime || new Date();
    const finishedAt = new Date(startTime.getTime() + result.duration).toISOString();

    await this.storage.appendTraceRecord({
      recordId: generateId(),
      runId: this.currentRunId,
      testId,
      eventType: 'test',
      timestamp: finishedAt,
      durationMs: result.duration,
      testTitle: test.title,
      testStatus: this.toRunStatus(result.status),
      testFile: test.location?.file,
      testLine: test.location?.line,
      retry: result.retry,
      workerIndex: result.workerIndex,
      browser: projectName,
      project: projectName,
      errorMessage: result.error?.message,
      stack: result.error?.stack,
    });

    // Capture screenshot attachments
    if (result.attachments) {
      for (const attachment of result.attachments) {
        if (
          attachment.name === 'screenshot' ||
          attachment.contentType?.startsWith('image/')
        ) {
          await this.storage.appendTraceRecord({
            recordId: generateId(),
            runId: this.currentRunId,
            testId,
            eventType: 'image',
            timestamp: finishedAt,
            imageId: generateId<ImageId>(),
            imagePath: attachment.path || '',
          });
        }
      }
    }
  }

  public async onStepBegin(
    test: TestCase,
    result: TestResult,
    step: TestStep,
  ): Promise<void> {
    const actionId = generateId<ActionId>();
    this.testStepMap.set(step, actionId);
    const testId = this.getTestId(test);

    await this.storage.appendTraceRecord({
      recordId: actionId,
      runId: this.currentRunId ?? ('' as RunId),
      testId,
      eventType: 'action',
      timestamp: step.startTime.toISOString(),
      actionId,
      actionName: step.title,
      actionCategory: step.category as ActionCategory,
      actionStatus: 'running',
    });
  }

  public async onStepEnd(
    test: TestCase,
    result: TestResult,
    step: TestStep,
  ): Promise<void> {
    const actionId = this.testStepMap.get(step) ?? generateId<ActionId>();
    const actionStatus = step.error ? 'failed' : 'completed';

    await this.storage.updateTraceRecord(actionId, {
      actionName: step.title,
      actionCategory: step.category as ActionCategory,
      actionStatus,
      durationMs: step.duration,
      errorMessage: step.error?.message,
      stack: step.error?.stack,
    });
  }

  public async onStdOut(
    chunk: string | Buffer,
    test: void | TestCase,
    result: void | TestResult,
  ): Promise<void> {
    if (!test || !this.currentRunId) {
      return;
    }
    await this.storage.appendTraceRecord({
      recordId: generateId(),
      runId: this.currentRunId,
      testId: this.getTestId(test),
      eventType: 'console',
      timestamp: new Date().toISOString(),
      consoleId: generateId<ConsoleId>(),
      consoleType: 'stdout',
      consoleMessage: typeof chunk === 'string' ? chunk : chunk.toString('utf8'),
    });
  }

  public async onStdErr(
    chunk: string | Buffer,
    test: void | TestCase,
    result: void | TestResult,
  ): Promise<void> {
    if (!test || !this.currentRunId) {
      return;
    }
    await this.storage.appendTraceRecord({
      recordId: generateId(),
      runId: this.currentRunId,
      testId: this.getTestId(test),
      eventType: 'console',
      timestamp: new Date().toISOString(),
      consoleId: generateId<ConsoleId>(),
      consoleType: 'stderr',
      consoleMessage: typeof chunk === 'string' ? chunk : chunk.toString('utf8'),
    });
  }

  public async onError(
    error: TestError,
    workerInfo?: WorkerInfo,
  ): Promise<void> {
    await this.storage.appendTraceRecord({
      recordId: generateId(),
      runId: this.currentRunId ?? ('' as RunId),
      testId: '' as TestId,
      eventType: 'error',
      timestamp: new Date().toISOString(),
      workerIndex: workerInfo?.workerIndex,
      errorMessage: error.message,
      stack: error.stack,
    });
  }

  public async onEnd(result: FullResult): Promise<void> {
    if (!this.currentRunId) {
      return;
    }

    const finishedAt = new Date().toISOString();
    await this.storage.appendTraceRecord({
      recordId: generateId(),
      runId: this.currentRunId,
      testId: '' as TestId,
      eventType: 'test',
      timestamp: finishedAt,
      runName: this.currentRunName ?? 'playwright-run',
      runStatus: result.status as TraceRecord['runStatus'],
    });

    if (this.outputFile) {
      await new ExcelCompiler(this.storage).compile({ outputFile: this.outputFile });
    }
  }

  private getTestId(test: TestCase): TestId {
    return (test.id ?? test.title) as TestId;
  }

  private toRunStatus(status: string): TraceRecord['testStatus'] {
    if (
      status === 'passed' ||
      status === 'failed' ||
      status === 'timedOut' ||
      status === 'skipped' ||
      status === 'interrupted'
    ) {
      return status;
    }
    return '';
  }
}
