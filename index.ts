type MapAsyncFn = <T, U>(xs: T[], fn: (x: T) => Promise<U>) => AsyncIterable<U>;
type MapFn = <T, U>(xs: T[], fn: (x: T) => U) => Iterable<U>;

export async function asyncIterToArray<T>(xs: AsyncIterable<T>) {
  const ret = new Array<T>();
  for await (const x of xs) {
    ret.push(x);
  }
  return ret;
}

export function iterToAsync<T>(iterable: Iterable<T> | Promise<Iterable<T>>): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]() {
      const iter = Promise.resolve(iterable).then(x => x[Symbol.iterator]());
      return {
        next: value =>
          iter.then(x => {
            return x.next(value);
          }),
        return: value =>
          iter.then(x => {
            if (x.return) {
              return x.return(value);
            }
            return { done: true, value };
          }),
        throw: e =>
          iter.then(x => {
            if (x.throw) {
              return x.throw(e);
            }
            throw e;
          })
      };
    }
  };
}

const mapEager: MapFn = (xs, fn) => {
  return xs.map(fn);
};

const mapEagerAsync: MapAsyncFn = (xs, fn) => {
  return iterToAsync(asyncIterToArray(mapLazyAsync(xs, fn)));
};

const mapLazy: MapFn = (xs, fn) => {
  return {
    *[Symbol.iterator]() {
      for (const x of xs) {
        yield fn(x);
      }
    }
  };
};

const mapLazyAsync: MapAsyncFn = (xs, fn) => {
  return {
    async *[Symbol.asyncIterator]() {
      for (const x of xs) {
        yield fn(x);
      }
    }
  };
};

const mapParallelAsync: MapAsyncFn = (xs, fn) => {
  return iterToAsync(Promise.all(xs.map(fn)));
};

class IteratorState<T> {
  private running: boolean = false;
  private iterator: Iterator<T>;
  constructor(iter: Iterable<T>) {
    this.iterator = iter[Symbol.iterator]();
  }
  next(input: unknown) {
    try {
      const result = this.iterator.next(input);
      this.running = !result.done;
      return result;
    } catch (e) {
      this.running = false;
      throw e;
    }
  }
  finish() {
    if (this.iterator.return && this.running) {
      this.iterator.return();
    }
  }
}

class AsyncIteratorState<T> {
  private running: Promise<boolean> | boolean = false;
  private iterator: AsyncIterator<T>;
  constructor(iter: AsyncIterable<T>) {
    this.iterator = iter[Symbol.asyncIterator]();
  }
  next(input: unknown) {
    const result = this.iterator.next(input);
    this.running = result.then(x => !x.done, () => false);
    return result;
  }
  async finish() {
    if (this.iterator.return && (await this.running)) {
      await this.iterator.return();
    }
  }
}

function mkZip(map: MapFn) {
  type I<T> = Iterable<T>;
  function zip(): I<[]>;
  function zip<A>(a: I<A>): I<[A]>;
  function zip<A, B>(a: I<A>, b: I<B>): I<[A, B]>;
  function zip<A, B, C>(a: I<A>, b: I<B>, c: I<C>): I<[A, B, C]>;
  function zip<A, B, C, D>(a: I<A>, b: I<B>, c: I<C>, d: I<D>): I<[A, B, C, D]>;
  function zip<A, B, C, D, E>(a: I<A>, b: I<B>, c: I<C>, d: I<D>, e: I<E>): I<[A, B, C, D, E]>;
  function zip<A, B, C, D, E, F>(a: I<A>, b: I<B>, c: I<C>, d: I<D>, e: I<E>, f: I<F>): I<[A, B, C, D, E, F]>;
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
            for (const { value, done } of map(iters, x => x.next(input))) {
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

function makeZipAsync(map: MapAsyncFn) {
  type AI<T> = AsyncIterable<T>;
  function zip(): AI<[]>;
  function zip<A>(a: AI<A>): AI<[A]>;
  function zip<A, B>(a: AI<A>, b: AI<B>): AI<[A, B]>;
  function zip<A, B, C>(a: AI<A>, b: AI<B>, c: AI<C>): AI<[A, B, C]>;
  function zip<A, B, C, D>(a: AI<A>, b: AI<B>, c: AI<C>, d: AI<D>): AI<[A, B, C, D]>;
  function zip<A, B, C, D, E>(a: AI<A>, b: AI<B>, c: AI<C>, d: AI<D>, e: AI<E>): AI<[A, B, C, D, E]>;
  function zip<A, B, C, D, E, F>(a: AI<A>, b: AI<B>, c: AI<C>, d: AI<D>, e: AI<E>, f: AI<F>): AI<[A, B, C, D, E, F]>;
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
            for await (const { done, value } of map(iters, x => x.next(input))) {
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
            for await (const _ of map(iters, async iter => {
              try {
                await iter.finish();
              } catch (e) {
                if (!error) {
                  error = { e };
                }
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

export const zip = mkZip(mapLazy);
export const zipAsync = makeZipAsync(mapParallelAsync);
export const zipAsyncSequential = makeZipAsync(mapLazyAsync);
