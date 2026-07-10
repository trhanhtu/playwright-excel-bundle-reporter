import { test, expect } from "vitest";
import { TraceParser } from '../../src/trace/TraceParser.js';

test('TraceParser can be instantiated', () => {
  const parser = new TraceParser();
  expect(parser).toBeInstanceOf(TraceParser);
});
