import { test, expect } from "vitest";
import { IdGenerator } from '../../src/database/ids/IdGenerator.js';

test('IdGenerator creates ids', () => {
  const id = IdGenerator.nextId();
  expect(id.startsWith('id-')).toBe(true);
});
