import type { ReporterOptions } from './ReporterOptions.js';
import { ExcelReporter } from './ExcelReporter.js';
import { MemoryStorage } from '../storage/memory/MemoryStorage.js';

export function createReporter(options: ReporterOptions = {}): ExcelReporter {
  const storage = options.storage ?? new MemoryStorage();
  return new ExcelReporter(storage);
}
