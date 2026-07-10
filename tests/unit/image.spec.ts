import { describe, it, expect } from 'vitest';
import { ImageEncoder } from '../../src/image/ImageEncoder';

describe('ImageEncoder', () => {
  it('can be instantiated', () => {
    const encoder = new ImageEncoder();
    expect(encoder).toBeInstanceOf(ImageEncoder);
  });
});
