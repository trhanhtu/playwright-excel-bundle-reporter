import { test, expect } from '@playwright/test';
import { ExcelReporter } from '../../src/reporter/ExcelReporter.js';
import { SqliteStorage } from '../../src/storage/sqlite/SqliteStorage.js';

test('ExcelReporter can be instantiated', () => {
  const reporter = new ExcelReporter(new SqliteStorage('memory'));
  expect(reporter).toBeInstanceOf(ExcelReporter);
});
