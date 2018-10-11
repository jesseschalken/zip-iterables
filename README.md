# zip-iterables

This package provides:

- A `zip` function that converts an array of `Iterable`s into an `Iterable` of arrays
  (`<T>(..iters: Iterable<T>[]) => Iterable<T[]>`).
- `zipAsyncSequential` and `zipAsyncParallel` functions that do the same for `AsyncIterable`s (difference described
  below).
- TypeScript overloads for n-tuples, such as `<A, B>(Iterable<A>, Iterable<B>) => Iterable<[A, B]>`.
- Some utilities:
  - `asyncIterableToArray<T>(iterable: AsyncIterable<T>): Promise<T[]>`
  - `iterableToAsyncIterable<T>(iterable: Iterable<T> | Promise<Iterable<T>>): AsyncIterable<T>`

## Example

```typescript
Array.from(zip(["a", "b", "c"], ["d", "e"], [1, 2]));
// Result:
// [
//   ['a', 'd', 1],
//   ['b', 'e', 2]
// ]
```

## Why this package?

It is fairly trivial to implement a basic `zip` function:

```typescript
// Example only. Do not do this in production.
function* zip<T>(...iterables: Iterable<T>[]): Iterable<T> {
  const iters = iterables.map(x => x[Symbol.iterator]());
  while (true) {
    const ret = new Array<T>();
    for (const iter of iters) {
      const { done, value } = iter.next();
      if (done) {
        return;
      }
      ret.push(value);
    }
    yield ret;
  }
}
```

However, the functions provided by this package have a number of important advantages over a naive implementation:

1. The resulting `Iterable` can be looped over multiple times (i.e. it returns a fresh `Iterator` in response to
   `[Symbol.iterator]()`). This would not be the case if `zip` itself is a generator function (as above).
2. As soon as `next` on one of the `Iterator`s either throws or returns `done = true`, the other `Iterator`s are
   closed by calling the `return` method, if defined. This gives the `Iterator` an opportunity to free any resources
   so they do not leak. For example, if the `Iterator` is a generator, this executes any `finally {..}` blocks around
   the current `yield`.
3. If any of the `Iterator`s throw in response to `return`, this does not prevent `return` from being called on the
   other `Iterator`s.
4. If any of the `Iterator`s throw in response to `return` and an error has already been caught, the original error
   is re-thrown instead of the new one. (This is what TypeScript and Babel do for a `for...of` loop.)
5. The `return` method is only called on `Iterator`s that have started (`next` called at least once) but not
   finished (`next` has not returned `done = true`) and not thrown. (This is what TypeScript and Babel do for a
   `for...of` loop.)
6. Any input passed to the zipped `Iterator` via the `next` method is forwarded to the individual `Iterator`s.
7. For `zipAsyncParallel`, the `next` and `return` methods of the `AsyncIterator`s are executed in parallel to
   maximise throughput. You can opt out of this by using `zipAsyncSequential` instead.
