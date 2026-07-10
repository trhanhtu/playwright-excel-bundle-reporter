import { test, expect } from "vitest";
import { Workbook } from '../../src/excel/Workbook.js';

test('Workbook can be instantiated', () => {
  const workbook = new Workbook();
  expect(workbook).toBeInstanceOf(Workbook);
});
