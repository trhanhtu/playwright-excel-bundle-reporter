import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import * as XLSX from 'xlsx';

export interface WorkbookRow {
  [key: string]: unknown;
}

export interface WorkbookSheetOptions {
  freezeHeader?: boolean;
  autoFilter?: boolean;
}

export class WorkbookBuilder {
  private readonly sheets: Array<{
    name: string;
    rows: WorkbookRow[];
    columns: string[];
    options: WorkbookSheetOptions;
  }> = [];

  public addSheet(
    name: string,
    rows: WorkbookRow[],
    columns: string[],
    options: WorkbookSheetOptions = {},
  ): void {
    this.sheets.push({ name, rows, columns, options });
  }

  public save(outputFile: string): void {
    const workbook = XLSX.utils.book_new();

    for (const sheet of this.sheets) {
      const worksheet = XLSX.utils.json_to_sheet(sheet.rows, {
        header: sheet.columns,
      });
      if (sheet.options.autoFilter) {
        worksheet['!autofilter'] = { ref: this.buildRange(sheet.columns, sheet.rows) };
      }
      if (sheet.options.freezeHeader) {
        worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };
      }
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    }

    mkdirSync(dirname(outputFile), { recursive: true });
    writeFileSync(outputFile, XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  }

  private buildRange(columns: string[], rows: WorkbookRow[]): string {
    const endColumn = XLSX.utils.encode_col(Math.max(columns.length - 1, 0));
    const endRow = Math.max(rows.length + 1, 1);
    return `A1:${endColumn}${endRow}`;
  }
}
