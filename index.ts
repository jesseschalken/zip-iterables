/** Convert an `AsyncIterable` into an array. */
export async function asyncIterableToArray<T>(xs: Iterable<T> | AsyncIterable<T>) {
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

/** Convert an `Iterable` or `Promise<Iterable>` into an `AsyncIterable`. */
export function iterableToAsyncIterable<T>(iterable: Iterable<T> | Promise<Iterable<T>>): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]() {
      const iter = (async () => (await iterable)[Symbol.iterator]())();
      return {
        next: async v => (await iter).next(v),
        return: async v => iteratorReturn(await iter, v),
        throw: async v => iteratorThrow(await iter, v)
      };
    }
  };
}

/** Call `Iterator.return`, using a default if the method is not defined. */
export function iteratorReturn<T>(x: Iterator<T>, y?: any) {
  if (x.return) return x.return(y);
  return { done: true, value: y } as IteratorResult<T>;
}

/** Call `Iterator.throw`, using a default if the method is not defined. */
export function iteratorThrow<T>(x: Iterator<T>, y?: any) {
  if (x.throw) return x.throw(y);
  throw y;
}

/** Call `AsyncIterator.return`, using a default if the method is not defined. */
export function asyncIteratorReturn<T>(x: Iterator<T> | AsyncIterator<T>, y?: any) {
  if (x.return) return x.return(y);
  return { done: true, value: y } as IteratorResult<T>;
}

/** Call `AsyncIterator.throw`, using a default if the method is not defined. */
export function asyncIteratorThrow<T>(x: Iterator<T> | AsyncIterator<T>, y?: any) {
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

function createZipIterator<T>(iters: Iterable<T>[]): Iterator<T[]> {
  const states = iters.map(x => new IteratorState(x[Symbol.iterator]()));

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

function getIteratorOrAsyncIterator<T>(x: Iterable<T> | AsyncIterable<T>) {
  return isAsyncIterable(x) ? x[Symbol.asyncIterator]() : x[Symbol.iterator]();
}

type AsyncMapFn = <T, U>(xs: T[], fn: (x: T) => U | Promise<U>) => U[] | Promise<U[]>;

const asyncMapSequential: AsyncMapFn = async (xs, fn) => {
  const ys = [];
  for await (const x of xs) {
    ys.push(await fn(x));
  }
  return ys;
};

const asyncMapParallel: AsyncMapFn = (xs, fn) => Promise.all(xs.map(fn));

class AsyncIteratorState<T> {
  done: boolean | Promise<boolean> = true;
  constructor(private iterator: Iterator<T> | AsyncIterator<T>) {}
  async modify(fn: (x: Iterator<T> | AsyncIterator<T>) => IteratorResult<T> | Promise<IteratorResult<T>>) {
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

function createAsyncZipIterator<T>(
  iters: (Iterable<T> | AsyncIterable<T>)[],
  asyncMap: AsyncMapFn = asyncMapSequential
): AsyncIterator<T[]> {
  const states = iters.map(x => new AsyncIteratorState(getIteratorOrAsyncIterator(x)));

  async function mapIters(fn: (x: Iterator<T> | AsyncIterator<T>) => IteratorResult<T> | Promise<IteratorResult<T>>) {
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

/** Convert multiple `Iterable`s into an `Iterable` of arrays.
 * The length of the resulting iterable is that of the shortest input iterable. */
export function zip<T>(...iterables: Iterable<T>[]): Iterable<T[]>;
/** Create an infinite `Iterable` of null tuples. */
export function zip(): Iterable<[]>;
/** Convert an `Iterable` into an `Iterable` of singletons. */
export function zip<A>(a: Iterable<A>): Iterable<[A]>;
/** Convert two `Iterable`s into an `Iterable` of pairs. */
export function zip<A, B>(a: Iterable<A>, b: Iterable<B>): Iterable<[A, B]>;
/** Convert three `Iterable`s into an `Iterable` of triplets. */
export function zip<A, B, C>(a: Iterable<A>, b: Iterable<B>, c: Iterable<C>): Iterable<[A, B, C]>;
/** Convert four `Iterable`s into an `Iterable` of 4-tuples. */
export function zip<A, B, C, D>(a: Iterable<A>, b: Iterable<B>, c: Iterable<C>, d: Iterable<D>): Iterable<[A, B, C, D]>;
/** Convert five `Iterable`s into an `Iterable` of 5-tuples. */
export function zip<A, B, C, D, E>(
  a: Iterable<A>,
  b: Iterable<B>,
  c: Iterable<C>,
  d: Iterable<D>,
  e: Iterable<E>
): Iterable<[A, B, C, D, E]>;
/** Convert six `Iterable`s into an `Iterable` of 6-tuples. */
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
    [Symbol.iterator]() {
      return createZipIterator(iterables);
    }
  };
}

/** Convert multiple `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of arrays.
 * The length of the resulting `AsyncIterable` is that of the shortest input iterable.
 * The methods of the input iterables are executed sequentially. */
export function zipAsync<T>(...iterables: (Iterable<T> | AsyncIterable<T>)[]): AsyncIterable<T[]>;

/** Create an infinite `AsyncIterable` of null tuples. */
export function zipAsync(): AsyncIterable<[]>;
/** Convert an `Iterable` or `AsyncIterable` into an `AsyncIterable` of singletons. */
export function zipAsync<A>(a: Iterable<A> | AsyncIterable<A>): AsyncIterable<[A]>;
/** Convert two `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of pairs. */
export function zipAsync<A, B>(
  a: Iterable<A> | AsyncIterable<A>,
  b: Iterable<B> | AsyncIterable<B>
): AsyncIterable<[A, B]>;
/** Convert three `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of triplets. */
export function zipAsync<A, B, C>(
  a: Iterable<A> | AsyncIterable<A>,
  b: Iterable<B> | AsyncIterable<B>,
  c: Iterable<C> | AsyncIterable<C>
): AsyncIterable<[A, B, C]>;
/** Convert four `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of 4-tuples. */
export function zipAsync<A, B, C, D>(
  a: Iterable<A> | AsyncIterable<A>,
  b: Iterable<B> | AsyncIterable<B>,
  c: Iterable<C> | AsyncIterable<C>,
  d: Iterable<D> | AsyncIterable<D>
): AsyncIterable<[A, B, C, D]>;
/** Convert five `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of 5-tuples. */
export function zipAsync<A, B, C, D, E>(
  a: Iterable<A> | AsyncIterable<A>,
  b: Iterable<B> | AsyncIterable<B>,
  c: Iterable<C> | AsyncIterable<C>,
  d: Iterable<D> | AsyncIterable<D>,
  e: Iterable<E> | AsyncIterable<E>
): AsyncIterable<[A, B, C, D, E]>;
/** Convert six `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of 6-tuples. */
export function zipAsync<A, B, C, D, E, F>(
  a: Iterable<A> | AsyncIterable<A>,
  b: Iterable<B> | AsyncIterable<B>,
  c: Iterable<C> | AsyncIterable<C>,
  d: Iterable<D> | AsyncIterable<D>,
  e: Iterable<E> | AsyncIterable<E>,
  f: Iterable<F> | AsyncIterable<F>
): AsyncIterable<[A, B, C, D, E, F]>;

export function zipAsync<T>(...iterables: (Iterable<T> | AsyncIterable<T>)[]): AsyncIterable<T[]> {
  return {
    [Symbol.asyncIterator]() {
      return createAsyncZipIterator(iterables);
    }
  };
}

/** Convert multiple `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of arrays.
 * The length of the resulting `AsyncIterable` is that of the shortest input iterable.
 * The methods of the iterators are executed in parallel using `Promise.all()` to maximise throughput. */
export function zipAsyncParallel<T>(...iterables: (Iterable<T> | AsyncIterable<T>)[]): AsyncIterable<T[]>;

/** Create an infinite `AsyncIterable` of null tuples. */
export function zipAsyncParallel(): AsyncIterable<[]>;
/** Convert an `Iterable` or `AsyncIterable` into an `AsyncIterable` of singletons. */
export function zipAsyncParallel<A>(a: Iterable<A> | AsyncIterable<A>): AsyncIterable<[A]>;
/** Convert two `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of pairs. */
export function zipAsyncParallel<A, B>(
  a: Iterable<A> | AsyncIterable<A>,
  b: Iterable<B> | AsyncIterable<B>
): AsyncIterable<[A, B]>;
/** Convert three `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of triplets. */
export function zipAsyncParallel<A, B, C>(
  a: Iterable<A> | AsyncIterable<A>,
  b: Iterable<B> | AsyncIterable<B>,
  c: Iterable<C> | AsyncIterable<C>
): AsyncIterable<[A, B, C]>;
/** Convert four `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of 4-tuples. */
export function zipAsyncParallel<A, B, C, D>(
  a: Iterable<A> | AsyncIterable<A>,
  b: Iterable<B> | AsyncIterable<B>,
  c: Iterable<C> | AsyncIterable<C>,
  d: Iterable<D> | AsyncIterable<D>
): AsyncIterable<[A, B, C, D]>;
/** Convert five `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of 5-tuples. */
export function zipAsyncParallel<A, B, C, D, E>(
  a: Iterable<A> | AsyncIterable<A>,
  b: Iterable<B> | AsyncIterable<B>,
  c: Iterable<C> | AsyncIterable<C>,
  d: Iterable<D> | AsyncIterable<D>,
  e: Iterable<E> | AsyncIterable<E>
): AsyncIterable<[A, B, C, D, E]>;
/** Convert six `Iterable`s or `AsyncIterable`s into an `AsyncIterable` of 6-tuples. */
export function zipAsyncParallel<A, B, C, D, E, F>(
  a: Iterable<A> | AsyncIterable<A>,
  b: Iterable<B> | AsyncIterable<B>,
  c: Iterable<C> | AsyncIterable<C>,
  d: Iterable<D> | AsyncIterable<D>,
  e: Iterable<E> | AsyncIterable<E>,
  f: Iterable<F> | AsyncIterable<F>
): AsyncIterable<[A, B, C, D, E, F]>;

export function zipAsyncParallel<T>(...iterables: (Iterable<T> | AsyncIterable<T>)[]): AsyncIterable<T[]> {
  return {
    [Symbol.asyncIterator]() {
      return createAsyncZipIterator(iterables, asyncMapParallel);
    }
  };
}

/** Test if a value is an `AsyncIterable`.
 * This is intended to be the same test done by `for await (..)` to determine
 * whether to call `[Symbol.asyncIterator]()` or `[Symbol.iterator]()`. */
export function isAsyncIterable(x: any): x is AsyncIterable<unknown> {
  return x[Symbol.asyncIterator] != null;
}

/** Test if a value is an `Iterable`. */
export function isIterable(x: any): x is Iterable<unknown> {
  return x[Symbol.iterator] != null;
}
