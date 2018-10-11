/**
 * Convert an `AsyncIterable` into an array.
 */
export async function asyncIterableToArray<T>(xs: AsyncIterable<T>): Promise<T[]> {
  const ret = new Array<T>();
  for await (const x of xs) {
    ret.push(x);
  }
  return ret;
}

/**
 * Convert an `Iterable` or `Promise<Iterable>` into an `AsyncIterable`.
 */
export function iterableToAsyncIterable<T>(iterable: Iterable<T> | Promise<Iterable<T>>): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]() {
      const _iter = Promise.resolve(iterable).then(x => x[Symbol.iterator]());
      return {
        async next(value: unknown): Promise<IteratorResult<T>> {
          return (await _iter).next(value);
        },
        async return(value: T): Promise<IteratorResult<T>> {
          const iter = await _iter;
          if (iter.return) {
            return iter.return(value);
          }
          return { done: true, value };
        },
        async throw(e: unknown): Promise<IteratorResult<T>> {
          const iter = await _iter;
          if (iter.throw) {
            return iter.throw(e);
          }
          throw e;
        }
      };
    }
  };
}

class IteratorState<T> {
  private isRunning: boolean = false;
  private iterator: Iterator<T>;
  constructor(iter: Iterable<T>) {
    this.iterator = iter[Symbol.iterator]();
  }
  next(input: unknown) {
    let result;
    try {
      result = this.iterator.next(input);
    } catch (e) {
      this.isRunning = false;
      throw e;
    }
    this.isRunning = !result.done;
    return result;
  }
  finish() {
    if (this.iterator.return && this.isRunning) {
      this.iterator.return();
    }
  }
}

class AsyncIteratorState<T> {
  private isRunning: Promise<boolean> | boolean = false;
  private iterator: AsyncIterator<T>;
  constructor(iter: AsyncIterable<T>) {
    this.iterator = iter[Symbol.asyncIterator]();
  }
  next(input: unknown) {
    const result = this.iterator.next(input);
    this.isRunning = result.then(x => !x.done, () => false);
    return result;
  }
  async finish() {
    // Always await this.isRunning to ensure finish() doesn't return until the iterator has really finished.
    const isRunning = await this.isRunning;
    if (this.iterator.return && isRunning) {
      await this.iterator.return();
    }
  }
}

function mkZip() {
  type I<T> = Iterable<T>;
  /** Create an infinite `Iterable` of null tuples. */
  function zip(): I<[]>;
  /** Convert an `Iterable` into an `Iterable` of singletons. */
  function zip<A>(a: I<A>): I<[A]>;
  /** Convert two `Iterable`s into an `Iterable` of pairs. */
  function zip<A, B>(a: I<A>, b: I<B>): I<[A, B]>;
  /** Convert three `Iterable`s into an `Iterable` of triplets. */
  function zip<A, B, C>(a: I<A>, b: I<B>, c: I<C>): I<[A, B, C]>;
  /** Convert four `Iterable`s into an `Iterable` of 4-tuples. */
  function zip<A, B, C, D>(a: I<A>, b: I<B>, c: I<C>, d: I<D>): I<[A, B, C, D]>;
  /** Convert five `Iterable`s into an `Iterable` of 5-tuples. */
  function zip<A, B, C, D, E>(a: I<A>, b: I<B>, c: I<C>, d: I<D>, e: I<E>): I<[A, B, C, D, E]>;
  /** Convert six `Iterable`s into an `Iterable` of 6-tuples. */
  function zip<A, B, C, D, E, F>(a: I<A>, b: I<B>, c: I<C>, d: I<D>, e: I<E>, f: I<F>): I<[A, B, C, D, E, F]>;
  /** Convert multiple `Iterable`s into an `Iterable` of arrays. */
  function zip<T>(...iterables: Iterable<T>[]): Iterable<T[]>;
  function zip<T>(...iterables: Iterable<T>[]): Iterable<T[]> {
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
                iter.finish();
              } catch (e) {
                if (!error) {
                  error = { e };
                }
                // If we already had an error set, ignore this one and let the old one get re-thrown.
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
  return zip;
}

function makeZipAsync(asyncMap: <T, U>(xs: T[], fn: (x: T) => Promise<U> | U) => AsyncIterable<U>) {
  type AI<T> = AsyncIterable<T>;
  /** Create an infinite `AsyncIterable` of null tuples. */
  function zip(): AI<[]>;
  /** Convert a `AsyncIterable` into an `AsyncIterable` of singletons. */
  function zip<A>(a: AI<A>): AI<[A]>;
  /** Convert two `AsyncIterable`s into an `AsyncIterable` of pairs. */
  function zip<A, B>(a: AI<A>, b: AI<B>): AI<[A, B]>;
  /** Convert three `AsyncIterable`s into an `AsyncIterable` of triplets. */
  function zip<A, B, C>(a: AI<A>, b: AI<B>, c: AI<C>): AI<[A, B, C]>;
  /** Convert four `AsyncIterable`s into an `AsyncIterable` of 4-tuples. */
  function zip<A, B, C, D>(a: AI<A>, b: AI<B>, c: AI<C>, d: AI<D>): AI<[A, B, C, D]>;
  /** Convert five `AsyncIterable`s into an `AsyncIterable` of 5-tuples. */
  function zip<A, B, C, D, E>(a: AI<A>, b: AI<B>, c: AI<C>, d: AI<D>, e: AI<E>): AI<[A, B, C, D, E]>;
  /** Convert six `AsyncIterable`s into an `AsyncIterable` of 6-tuples. */
  function zip<A, B, C, D, E, F>(a: AI<A>, b: AI<B>, c: AI<C>, d: AI<D>, e: AI<E>, f: AI<F>): AI<[A, B, C, D, E, F]>;
  /** Convert multiple `AsyncIterable`s into an `AsyncIterable` of arrays. */
  function zip<T>(...iterables: AsyncIterable<T>[]): AsyncIterable<T[]>;
  function zip<T>(...iterables: AsyncIterable<T>[]): AsyncIterable<T[]> {
    return {
      async *[Symbol.asyncIterator]() {
        const iters = iterables.map(x => new AsyncIteratorState(x));
        let error: { e: unknown } | null = null;
        try {
          let input: unknown = undefined;
          while (true) {
            const ret = new Array<T>();
            for await (const { done, value } of asyncMap(iters, x => x.next(input))) {
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
            for await (const _ of asyncMap(iters, async iter => {
              try {
                await iter.finish();
              } catch (e) {
                if (!error) {
                  error = { e };
                }
                // If an error has already been caught, ignore this one and let the old one get re-thrown.
              }
            })) {
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
  return zip;
}

/**
 * Convert multiple `Iterable`s into an `Iterable` of arrays. The length of the resulting iterable is that of the
 * shortest input iterable.
 */
export const zip = mkZip();

/**
 * Convert multiple `AsyncIterable`s into an `AsyncIterable` of arrays. The `next()` and `return()` methods of the
 * iterators are executed in parallel using `Promise.all()` to maximise throughput.
 */
export const zipAsyncParallel = makeZipAsync(async function*(xs, fn) {
  yield* await Promise.all(xs.map(fn));
});

/**
 * Convert multiple `AsyncIterable`s into an `AsyncIterable` of arrays. The `next()` and `return()` methods of the
 * iterators are executed sequentially, providing the same semantics as `zip`.
 */
export const zipAsyncSequential = makeZipAsync(async function*(xs, fn) {
  for await (const x of xs) {
    yield fn(x);
  }
});
