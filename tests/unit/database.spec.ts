import { test, expect } from '@playwright/test';
import { Database } from '../../src/database/Database.js';

test('Database can be instantiated', () => {
  const database = new Database();
  expect(database).toBeInstanceOf(Database);
});
