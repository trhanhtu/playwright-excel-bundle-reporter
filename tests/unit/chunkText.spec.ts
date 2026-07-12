import { test, expect } from 'vitest';
import { chunkText, reconstructChunks } from '../../src/utils/chunkText.js';

test('chunkText splits content into chunks', () => {
  let finalMessage = '';
  for (let index = 0; index < 10; index++) {
    finalMessage += index.toString().repeat(200);
  }
  console.log(finalMessage.length);
  const chunks = chunkText(finalMessage, 200);
  console.log(chunks.length);
  expect(chunks.length).toBe(10);
});

test('reconstructChunks joins chunks in the correct order', () => {
  const chunks = [
    { chunkParentId: 'BODY001', chunkIndex: 2, content: 'three' },
    { chunkParentId: 'BODY002', chunkIndex: 0, content: 'other' },
    { chunkParentId: 'BODY001', chunkIndex: 0, content: 'one' },
    { chunkParentId: 'BODY001', chunkIndex: 1, content: 'two' },
  ];
  const result = reconstructChunks(chunks, 'BODY001');
  expect(result).toBe('onetwothree');
});
