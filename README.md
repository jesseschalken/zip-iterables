# zip-iterables

This package provides:

- A `zip` function that converts an array of `Iterable`s into an `Iterable` of arrays.
- `zipAsync` and `zipAsyncParallel` functions that do the same for `AsyncIterable`s.
- TypeScript overloads for n-tuples, such as `<A, B>(Iterable<A>, Iterable<B>) => Iterable<[A, B]>`.
- Some utility functions:
  - `isAsyncIterable`
  - `isIterable`
  - `iteratorReturn`
  - `iteratorThrow`
  - `asyncIteratorReturn`
  - `asyncIteratorThrow`

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

1. The resulting `Iterable` or `AsyncIterable` can be looped over multiple times (i.e. it returns a fresh iterator in
   response to `[Symbol.iterator]()` and `[Symbol.asyncIterator]()`). This would not be the case if `zip` itself is a
   generator function (as above).
2. All three of the `next`, `return` and `throw` methods, instead of just `next`, are forwarded to the inner iterators
   and the results collated.
3. Return values (`value` of the `IteratorResult` when `done = true`) are also collated from inner iterators in addition
   to yielded values, with `undefined` used as the value for iterators that have not finished.
4. As soon as `next`, `return` or `throw` on one of the iterators either throws or returns `done = true`, the other
   iterators are closed by calling the `return` method, if defined. This gives the iterator an opportunity to free any
   resources so they do not leak. For example, if the iterator is a generator, this executes any `finally {..}` blocks
   around the current `yield`.
5. If any of the iterators throw in response to `return`, this does not prevent `return` from being called on the other
   iterators.
6. If any of the iterators throw and an error has already been caught, the original error is re-thrown instead of the
   new one. (This is what TypeScript and Babel do for a `for...of` loop.)
7. The `return` method is only called on iterators that have started (`next` called at least once) but not finished
   (`next` has not returned `done = true`) and not thrown. (This is what TypeScript and Babel do for a `for...of` loop.)
8. Any input passed to the zipped iterator via the `next`, `return` and `throw` methods is forwarded to the individual
   iterators.
9. For `zipAsyncParallel`, the `next`, `return` and `throw` methods of the `AsyncIterator`s are executed in parallel to
   maximise throughput.
