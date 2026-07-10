import { test, expect } from '@playwright/test';
import { Workbook } from '../../src/excel/Workbook.js';

test('Workbook can be instantiated', () => {
  const workbook = new Workbook();
  expect(workbook).toBeInstanceOf(Workbook);
});
