import { test, expect } from 'vitest';
import { generateId } from '../../src/utils/generateUUID.js';
import type { RunId } from '../../src/types/ids.js';

test('generateId creates a non-empty UUID-like string', () => {
  const id = generateId();
  expect(typeof id).toBe('string');
  expect(id.length).toBeGreaterThan(0);
});

test('generateId supports branded types', () => {
  const runId = generateId<RunId>();
  expect(typeof runId).toBe('string');
});
