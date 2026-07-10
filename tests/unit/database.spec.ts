import { describe, it, expect } from 'vitest';
import { Database } from '../../src/database/Database';

describe('Database', () => {
  it('can be instantiated', () => {
    const database = new Database();
    expect(database).toBeInstanceOf(Database);
  });
});
