import { describe, it, expect } from 'vitest';
import { Workbook } from '../../src/excel/Workbook';

describe('Workbook', () => {
  it('can be instantiated', () => {
    const workbook = new Workbook();
    expect(workbook).toBeInstanceOf(Workbook);
  });
});
