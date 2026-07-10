import { describe, it, expect } from 'vitest';
import { chunkText } from '../../src/utils/chunkText';

describe('chunkText', () => {
  it('splits content into chunks', () => {
    const chunks = chunkText('abcde', 2);
    expect(chunks).toEqual(['ab', 'cd', 'e']);
  });
});
