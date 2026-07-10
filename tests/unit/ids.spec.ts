import { describe, it, expect } from 'vitest';
import { IdGenerator } from '../../src/database/ids/IdGenerator';

describe('IdGenerator', () => {
  it('creates ids', () => {
    const id = IdGenerator.nextId();
    expect(id.startsWith('id-')).toBe(true);
  });
});
