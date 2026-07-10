import { describe, it, expect } from 'vitest';
import { ExcelReporter } from '../../src/reporter/ExcelReporter';

describe('ExcelReporter', () => {
  it('can be instantiated', () => {
    const reporter = new ExcelReporter();
    expect(reporter).toBeInstanceOf(ExcelReporter);
  });
});
