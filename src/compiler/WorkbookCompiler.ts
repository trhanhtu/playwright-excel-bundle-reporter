import type { Storage } from '../storage/Storage.js';
import { Workbook } from '../excel/Workbook.js';

export class WorkbookCompiler {
  constructor(private readonly storage: Storage) {}

  public async compile(outputFile: string): Promise<Workbook> {
    const workbook = new Workbook();
    void outputFile;
    return workbook;
  }
}
