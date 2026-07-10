import { test, expect } from '@playwright/test';
import { ImageEncoder } from '../../src/image/ImageEncoder.js';

test('ImageEncoder can be instantiated', () => {
  const encoder = new ImageEncoder();
  expect(encoder).toBeInstanceOf(ImageEncoder);
});
