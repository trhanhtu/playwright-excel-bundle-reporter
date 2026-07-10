import type { ReporterOptions } from './ReporterOptions.js';
import { ExcelReporter } from './ExcelReporter.js';

export function createReporter(options: ReporterOptions = {}) {
  return new ExcelReporter();
}
