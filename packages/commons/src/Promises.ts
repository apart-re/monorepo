import { map } from "bluebird";

export const mapConcurrent = <T, U>(
  iterable: T[],
  // eslint-disable-next-line no-unused-vars
  fn: (value: T) => Promise<U>,
  concurrency: number = 10
): Promise<U[]> => map(iterable, fn, { concurrency });
