import { test, expect } from "vitest";
import { ImageEncoder } from '../../src/image/ImageEncoder.js';

test('ImageEncoder can be instantiated', () => {
  const encoder = new ImageEncoder();
  expect(encoder).toBeInstanceOf(ImageEncoder);
});
