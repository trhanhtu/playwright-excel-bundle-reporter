import { describe, it, expect } from 'vitest';
import { TraceParser } from '../../src/trace/TraceParser';

describe('TraceParser', () => {
  it('can be instantiated', () => {
    const parser = new TraceParser();
    expect(parser).toBeInstanceOf(TraceParser);
  });
});
