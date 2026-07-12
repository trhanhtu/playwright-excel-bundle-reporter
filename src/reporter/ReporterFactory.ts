import type { ReporterOptions } from './ReporterOptions.js';
import { ExcelReporter } from './ExcelReporter.js';
import { MemoryTraceStorage } from '../trace/MemoryTraceStorage.js';

export function createReporter(options: ReporterOptions = {}): ExcelReporter {
  return new ExcelReporter({
    ...options,
    storage: options.storage ?? new MemoryTraceStorage(),
  });
}
