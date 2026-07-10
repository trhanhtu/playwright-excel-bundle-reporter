import { test, expect } from '@playwright/test';
import { chunkText } from '../../src/utils/chunkText.js';

test('chunkText splits content into chunks', () => {
  const chunks = chunkText('abcde', 2);
  expect(chunks).toEqual(['ab', 'cd', 'e']);
});
