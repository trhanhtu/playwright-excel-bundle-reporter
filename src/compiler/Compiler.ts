import type { Storage } from '../storage/Storage.js';
import { WorkbookCompiler } from './WorkbookCompiler.js';

export interface CompilerOptions {
  outputFile: string;
}

export class Compiler {
  constructor(
    private readonly storage: Storage,
    private readonly workbookCompiler: WorkbookCompiler = new WorkbookCompiler(storage),
  ) {}

  public async compile(options: CompilerOptions): Promise<void> {
    await this.workbookCompiler.compile(options.outputFile);
  }
}
