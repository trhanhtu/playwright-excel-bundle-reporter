import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import * as XLSX from 'xlsx';

export interface WorkbookRow {
  [key: string]: unknown;
}

export class Workbook {
  private readonly sheets: Array<{ name: string; rows: WorkbookRow[] }> = [];

  public addSheet(name: string, rows: WorkbookRow[]): void {
    this.sheets.push({ name, rows });
  }

  public save(outputFile: string): void {
    const workbook = XLSX.utils.book_new();

    for (const sheet of this.sheets) {
      const worksheet = XLSX.utils.json_to_sheet(sheet.rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    }

    mkdirSync(dirname(outputFile), { recursive: true });
    writeFileSync(outputFile, XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  }
}
