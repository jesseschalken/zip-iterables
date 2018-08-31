/**
 * Just a wrapper for an Iterator that captures the last result to ensure return() is not called unless
 * the iterator is currently in-progress (started and not finished).
 */
class IteratorState<T> {
  private result: IteratorResult<T> | null = null;
  private iterator: Iterator<T>;
  constructor(iter: Iterable<T>) {
    this.iterator = iter[Symbol.iterator]();
  }
  next(input: unknown) {
    this.result = this.iterator.next(input);
    return this.result;
  }
  return() {
    if (this.iterator.return && this.result && !this.result.done) {
      this.iterator.return();
    }
  }
}

export function zip(): Iterable<[]>;
export function zip<A>(a: Iterable<A>): Iterable<[A]>;
export function zip<A, B>(a: Iterable<A>, b: Iterable<B>): Iterable<[A, B]>;
export function zip<A, B, C>(
  a: Iterable<A>,
  b: Iterable<B>,
  c: Iterable<C>
): Iterable<[A, B, C]>;
export function zip<A, B, C, D>(
  a: Iterable<A>,
  b: Iterable<B>,
  c: Iterable<C>,
  d: Iterable<D>
): Iterable<[A, B, C, D]>;
export function zip<A, B, C, D, E>(
  a: Iterable<A>,
  b: Iterable<B>,
  c: Iterable<C>,
  d: Iterable<D>,
  e: Iterable<E>
): Iterable<[A, B, C, D, E]>;
export function zip<A, B, C, D, E, F>(
  a: Iterable<A>,
  b: Iterable<B>,
  c: Iterable<C>,
  d: Iterable<D>,
  e: Iterable<E>,
  f: Iterable<F>
): Iterable<[A, B, C, D, E, F]>;

export function zip<T>(...iterables: Iterable<T>[]): Iterable<T[]> {
  return {
    *[Symbol.iterator]() {
      const iters = iterables.map(x => new IteratorState(x));
      let error: { e: unknown } | null = null;
      try {
        let input: unknown = undefined;
        while (true) {
          const ret = new Array<T>();
          for (const iter of iters) {
            const { value, done } = iter.next(input);
            if (done) {
              return;
            }
            ret.push(value);
          }
          input = yield ret;
        }
      } catch (e) {
        error = { e };
      } finally {
        try {
          for (const iter of iters) {
            try {
              iter.return();
            } catch (e) {
              if (!error) {
                error = { e };
              }
            }
          }
        } finally {
          if (error) {
            throw error.e;
          }
        }
      }
    }
  };
}

/**
 * Just a wrapper for an AsyncIterator that captures the last result to ensure that return() is only called if the
 * iterator is currently in-progress (started and not finished).
 */
class AsyncIteratorState<T> {
  private result: Promise<IteratorResult<T>> | null = null;
  private iterator: AsyncIterator<T>;
  constructor(iter: AsyncIterable<T>) {
    this.iterator = iter[Symbol.asyncIterator]();
  }
  next(input: unknown) {
    this.result = this.iterator.next(input);
    return this.result;
  }
  async return() {
    if (this.iterator.return && this.result && !(await this.result).done) {
      await this.iterator.return();
    }
  }
}

export function zipAsync(): AsyncIterable<[]>;
export function zipAsync<A>(a: AsyncIterable<A>): AsyncIterable<[A]>;
export function zipAsync<A, B>(
  a: AsyncIterable<A>,
  b: AsyncIterable<B>
): AsyncIterable<[A, B]>;
export function zipAsync<A, B, C>(
  a: AsyncIterable<A>,
  b: AsyncIterable<B>,
  c: AsyncIterable<C>
): AsyncIterable<[A, B, C]>;
export function zipAsync<A, B, C, D>(
  a: AsyncIterable<A>,
  b: AsyncIterable<B>,
  c: AsyncIterable<C>,
  d: AsyncIterable<D>
): AsyncIterable<[A, B, C, D]>;
export function zipAsync<A, B, C, D, E>(
  a: AsyncIterable<A>,
  b: AsyncIterable<B>,
  c: AsyncIterable<C>,
  d: AsyncIterable<D>,
  e: AsyncIterable<E>
): AsyncIterable<[A, B, C, D, E]>;
export function zipAsync<A, B, C, D, E, F>(
  a: AsyncIterable<A>,
  b: AsyncIterable<B>,
  c: AsyncIterable<C>,
  d: AsyncIterable<D>,
  e: AsyncIterable<E>,
  f: AsyncIterable<F>
): AsyncIterable<[A, B, C, D, E, F]>;

export function zipAsync<T>(
  ...iterables: AsyncIterable<T>[]
): AsyncIterable<T[]> {
  return {
    async *[Symbol.asyncIterator]() {
      const iters = iterables.map(x => new AsyncIteratorState(x));
      let error: { e: unknown } | null = null;
      try {
        let input: unknown = undefined;
        while (true) {
          const ret = new Array<T>();
          for (const { done, value } of await Promise.all(
            iters.map(x => x.next(input))
          )) {
            if (done) {
              return;
            }
            ret.push(value);
          }
          input = yield ret;
        }
      } catch (e) {
        error = { e };
      } finally {
        try {
          await Promise.all(
            iters.map(async iter => {
              try {
                await iter.return();
              } catch (e) {
                if (!error) {
                  error = { e };
                }
              }
            })
          );
        } finally {
          if (error) {
            throw error.e;
          }
        }
      }
    }
  };
}
