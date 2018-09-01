# zip-iterables

This package provides:
- A `zip<T>(...Iterable<T>[]): Iterable<T[]>` function that converts an array of `Iterable`s into an `Iterable` of arrays.
- A `zipAsync<T>(...AsyncIterable<T>[]): AsyncIterable<T[]>` function that does the same for `AsyncIterable`s.
- TypeScript overloads for n-tuples, such as `zip<A, B>(Iterable<A>, Iterable<B>): Iterable<[A, B]>`.

Example:

```typescript
Array.from(zip(
  ['a', 'b', 'c'],
  ['d', 'e'],
  [1, 2]
))
// Result:
[
  ['a', 'd', 1],
  ['b', 'e', 2]
]
```

It is fairly trivial to implement a basic `zip` function:

```typescript
// Example only. Do not do this in production.
function* zip<T>(...iterables: Iterable<T>[]): Iterable<T> {
  const iters = iterables.map(x => x[Symbol.iterator]());
  while (true) {
    const ret = new Array<T>();
    for (const iter of iters) {
      const {done, value} = iter.next();
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
1. The resulting `Iterable` can be looped over multiple times (i.e. it returns a fresh `Iterator` in response to `[Symbol.iterator]()`). This would not be the case if `zip` itself is a generator function.
2. As soon as `next()` on one of the `Iterator`s either returns `done = true` or throws, the other `Iterator`s are closed by calling the `return()` method, if defined. This gives the `Iterator` an opportunity to free any resources so they do not leak. For example, if the `Iterator` is a generator, this executes any `finally {..}` blocks around the current `yield`.
4. If any of the `Iterator`s throw in response to `return()`, this does not prevent `return()` from being called on the other `Iterator`s.
5. If any of the `Iterator`s throw in response to `return()` and an error has already been caught, the original error is re-thrown instead of the new one. (This is what TypeScript and Babel do for a `for...of` loop.)
3. The `return()` method is only called on `Iterator`s that have started (`next()` called at least once) but not finished (`next()` has not returned `done = true`) and not thrown. (This is what TypeScript and Babel do for a `for...of` loop.)
6. Any input passed to the zipped `Iterator` via the `next()` method is forwarded to the individual `Iterator`s.
7. For `zipAsync`, the `next()` and `return()` methods of the `AsyncIterator`s are executed in parallel to maximise throughput.
