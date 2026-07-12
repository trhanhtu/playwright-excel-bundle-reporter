import type { TraceStorage } from '../trace/TraceStorage.js';

export interface ReporterOptions {
  outputFile?: string;
  storage?: TraceStorage;
}
