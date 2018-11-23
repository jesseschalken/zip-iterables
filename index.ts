/** A thing or a `Promise` of it. */
type OrPromise<T> = T | Promise<T>;
/** An `Iterable` or an `AsyncIterable`. */
type IterableOrAsyncIterable<T> = Iterable<T> | AsyncIterable<T>;
/** An `Iterator` or an `AsyncIterator`. */
type IteratorOrAsyncIterator<T> = Iterator<T> | AsyncIterator<T>;

/**
 * Convert an `AsyncIterable` into an array.
 */
export async function asyncIterableToArray<T>(xs: IterableOrAsyncIterable<T>) {
  if (isAsyncIterable(xs)) {
    const ret = new Array<T>();
    for await (const x of xs) {
      ret.push(x);
    }
    return ret;
  } else {
    // For an Iterable this will probably be more efficient that the loop above.
    return Array.from(xs);
  }
}

/**
 * Convert an `Iterable` or `Promise<Iterable>` into an `AsyncIterable`.
 */
export function iterableToAsyncIterable<T>(iterable: Iterable<T> | Promise<Iterable<T>>): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]() {
      const _iter = Promise.resolve(iterable).then(x => x[Symbol.iterator]());
      return {
        async next(value: unknown) {
          return (await _iter).next(value);
        },
        async return(value: T) {
          const iter = await _iter;
          if (iter.return) {
            return iter.return(value);
          }
          return { done: true, value };
        },
        async throw(e: unknown) {
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

function iteratorReturn<T>(x: Iterator<T>, y?: any) {
  if (x.return) return x.return(y);
  return { done: true, value: y };
}

function iteratorThrow<T>(x: Iterator<T>, y?: any) {
  if (x.throw) return x.throw(y);
  throw y;
}

function asyncIteratorReturn<T>(x: IteratorOrAsyncIterator<T>, y?: any) {
  if (x.return) return x.return(y);
  return { done: true, value: y };
}

function asyncIteratorThrow<T>(x: IteratorOrAsyncIterator<T>, y?: any) {
  if (x.throw) return x.throw(y);
  throw y;
}

class IteratorState<T> {
  done: boolean = true;
  constructor(private iterator: Iterator<T>) {}
  modify(fn: (x: Iterator<T>) => IteratorResult<T>) {
    try {
      const result = fn(this.iterator);
      this.done = result.done;
      return result;
    } catch (e) {
      this.done = true;
      throw e;
    }
  }
}

function zipIterator<T>(iters: Iterator<T>[]): Iterator<T[]> {
  const states = iters.map(x => new IteratorState(x));

  function mapIters(fn: (iter: Iterator<T>) => IteratorResult<T>) {
    try {
      const results = states.map(x => x.modify(fn));
      const done = results.some(x => x.done);
      const value = results.map(x => (x.done == done ? x.value : undefined!));
      if (done) {
        states.forEach(x => {
          if (!x.done) x.modify(x => iteratorReturn(x));
        });
      }
      return { done, value };
    } catch (e) {
      states.forEach(x => {
        try {
          if (!x.done) x.modify(x => iteratorReturn(x));
        } catch (_) {}
      });
      throw e;
    }
  }

  return {
    next: (v: any) => mapIters(x => x.next(v)),
    throw: (v: any) => mapIters(x => iteratorThrow(x, v)),
    return: (v: T) => mapIters(x => iteratorReturn(x, v))
  };
}

function getIteratorOrAsyncIterator<T>(x: IterableOrAsyncIterable<T>) {
  return isAsyncIterable(x) ? x[Symbol.asyncIterator]() : x[Symbol.iterator]();
}

type AsyncMapFn = <T, U>(xs: T[], fn: (x: T) => OrPromise<U>) => OrPromise<U[]>;

class AsyncIteratorState<T> {
  done: OrPromise<boolean> = true;
  constructor(private iterator: IteratorOrAsyncIterator<T>) {}
  async modify(fn: (x: IteratorOrAsyncIterator<T>) => OrPromise<IteratorResult<T>>) {
    // Fetch the result through an async function so failure is always captured as a rejected
    // Promise instead of as a synchronous throw.
    const result = (async () => fn(this.iterator))();
    async function isDone() {
      try {
        return (await result).done;
      } catch (e) {
        return true;
      }
    }
    this.done = isDone();
    return result;
  }
}

function asyncZipIterator<T>(iters: IteratorOrAsyncIterator<T>[], asyncMap: AsyncMapFn): AsyncIterator<T[]> {
  const states = iters.map(x => new AsyncIteratorState(x));

  async function mapIters(fn: (x: IteratorOrAsyncIterator<T>) => OrPromise<IteratorResult<T>>) {
    try {
      const results = await asyncMap(states, x => x.modify(fn));
      const done = results.some(x => x.done);
      const value = results.map(x => (x.done == done ? x.value : undefined!));
      if (done) {
        await asyncMap(states, async x => {
          if (!(await x.done)) await x.modify(x => asyncIteratorReturn(x));
        });
      }
      return { done, value };
    } catch (e) {
      await asyncMap(states, async x => {
        try {
          if (!(await x.done)) await x.modify(x => asyncIteratorReturn(x));
        } catch (_) {}
      });
      throw e;
    }
  }

  return {
    next: (v: any) => mapIters(x => x.next(v)),
    throw: (v: any) => mapIters(x => asyncIteratorThrow(x, v)),
    return: (v: T) => mapIters(x => asyncIteratorReturn(x, v))
  };
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
      [Symbol.iterator]() {
        return zipIterator(iterables.map(x => x[Symbol.iterator]()));
      }
    };
  }
  return zip;
}

function makeZipAsync(asyncMap: AsyncMapFn) {
  type AI<T> = IterableOrAsyncIterable<T>;
  type A_<T> = AsyncIterable<T>;
  /** Create an infinite `AsyncIterable` of null tuples. */
  function zip(): A_<[]>;
  /** Convert an `Iterable` or `AsyncIterable` into an `AsyncIterable` of singletons. */
  function zip<A>(a: AI<A>): A_<[A]>;
  /** Convert two `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of pairs. */
  function zip<A, B>(a: AI<A>, b: AI<B>): A_<[A, B]>;
  /** Convert three `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of triplets. */
  function zip<A, B, C>(a: AI<A>, b: AI<B>, c: AI<C>): A_<[A, B, C]>;
  /** Convert four `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of 4-tuples. */
  function zip<A, B, C, D>(a: AI<A>, b: AI<B>, c: AI<C>, d: AI<D>): A_<[A, B, C, D]>;
  /** Convert five `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of 5-tuples. */
  function zip<A, B, C, D, E>(a: AI<A>, b: AI<B>, c: AI<C>, d: AI<D>, e: AI<E>): A_<[A, B, C, D, E]>;
  /** Convert six `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of 6-tuples. */
  function zip<A, B, C, D, E, F>(a: AI<A>, b: AI<B>, c: AI<C>, d: AI<D>, e: AI<E>, f: AI<F>): A_<[A, B, C, D, E, F]>;
  /** Convert multiple `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of arrays. */
  function zip<T>(...iterables: AI<T>[]): A_<T[]>;
  function zip<T>(...iterables: AI<T>[]): A_<T[]> {
    return {
      [Symbol.asyncIterator]() {
        return asyncZipIterator(iterables.map(x => getIteratorOrAsyncIterator(x)), asyncMap);
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
 * Convert multiple `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of arrays. The `next()` and `return()`
 * methods of the iterators are executed in parallel using `Promise.all()` to maximise throughput.
 */
export const zipAsyncParallel = makeZipAsync(function(xs, fn) {
  return Promise.all(xs.map(fn));
});

/**
 * Convert multiple `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of arrays. The `next()` and `return()`
 * methods of the iterators are executed sequentially, providing the same semantics as `zip`.
 */
export const zipAsyncSequential = makeZipAsync(async function(xs, fn) {
  const ys = [];
  for await (const x of xs) {
    ys.push(await fn(x));
  }
  return ys;
});

/**
 * Test if a value is an `AsyncIterable`.
 * This is intended to be the same test done by `for await (..)` to determine whether to call
 * `[Symbol.asyncIterator]()` or `[Symbol.iterator]()`.
 */
export function isAsyncIterable(x: any): x is AsyncIterable<unknown> {
  return x[Symbol.asyncIterator] != null;
}

/**
 * Test if a value is an `Iterable`.
 */
export function isIterable(x: any): x is Iterable<unknown> {
  return x[Symbol.iterator] != null;
}
