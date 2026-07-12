export type Brand<T, Name extends string> = T & {
  readonly __brand: Name;
};

export type RunId = Brand<string, 'RunId'>;
export type TestId = Brand<string, 'TestId'>;
export type ActionId = Brand<string, 'ActionId'>;
export type RequestId = Brand<string, 'RequestId'>;
export type ConsoleId = Brand<string, 'ConsoleId'>;
export type ImageId = Brand<string, 'ImageId'>;
