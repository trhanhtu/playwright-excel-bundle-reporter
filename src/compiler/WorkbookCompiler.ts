import type { Storage } from '../storage/Storage.js';
import { Workbook } from '../excel/Workbook.js';

export class WorkbookCompiler {
  constructor(private readonly storage: Storage) {}

  public async compile(outputFile: string): Promise<Workbook> {
    const runs = await this.storage.getRuns();
    const tests = await this.storage.getTests();
    const actions = await this.storage.getActions();
    const requests = await this.storage.getRequests();
    const consoleEntries = await this.storage.getConsoleEntries();

    const workbook = new Workbook();
    workbook.addSheet('Runs', runs.map((run) => ({ ...run })));
    workbook.addSheet('Tests', tests.map((test) => ({ ...test })));
    workbook.addSheet('Actions', actions.map((action) => ({ ...action })));
    workbook.addSheet('Requests', requests.map((request) => ({ ...request })));
    workbook.addSheet('Console', consoleEntries.map((entry) => ({ ...entry })));
    workbook.save(outputFile);

    return workbook;
  }
}
