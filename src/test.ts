import { strict as assert } from "assert";
import { zip, zipAsyncParallel, zipAsyncSequential, iterableToAsyncIterable, asyncIterableToArray } from "./index";

const mkIter = <T>(gen: () => Iterator<T>) => ({ [Symbol.iterator]: gen });
const mkIterAsync = <T>(gen: () => AsyncIterator<T>) => ({ [Symbol.asyncIterator]: gen });

interface MonitorResult<T> {
  err?: unknown;
  ret?: T;
  log?: unknown[];
}

function cleanMonitorResult<T>(r: MonitorResult<T>): MonitorResult<T> {
  const { err, ret, log = [] } = r;
  return { log, err, ret };
}

interface AssertMonitorParams<T> extends MonitorResult<T> {
  fn(log: (s: unknown) => void): Promise<T>;
}

async function assertMonitorAsync<T>(params: AssertMonitorParams<T>): Promise<void> {
  const log = new Array<unknown>();
  const actual: MonitorResult<T> = { log };
  try {
    actual.ret = await params.fn(s => void log.push(s));
  } catch (e) {
    actual.err = e;
  }
  assert.deepStrictEqual(cleanMonitorResult(actual), cleanMonitorResult(params));
}

async function basic(zip: ZipImpl) {
  assert.deepStrictEqual(await asyncIterableToArray(zip<unknown>([1, 2, 3], ["a", "b", "c"])), [
    [1, "a"],
    [2, "b"],
    [3, "c"]
  ]);
}

async function lengthIsShortest(zip: ZipImpl) {
  assert.deepStrictEqual(await asyncIterableToArray(zip<unknown>(["a"], ["b", "c"])), [["a", "b"]]);
}

async function loopMultipleTimes(zip: ZipImpl) {
  const list = zip(
    mkIter(function*() {
      yield "a";
      yield "x";
    }),
    mkIter(function*() {
      yield "b";
      yield "y";
    }),
    mkIter(function*() {
      yield "c";
      yield "z";
    })
  );
  const ret = [["a", "b", "c"], ["x", "y", "z"]];
  assert.deepStrictEqual(await asyncIterableToArray(list), ret);
  assert.deepStrictEqual(await asyncIterableToArray(list), ret);
}

async function finallyCalled(zip: ZipImpl) {
  await assertMonitorAsync({
    fn(log) {
      return asyncIterableToArray(
        zip(
          mkIter(function*() {
            try {
              yield "a";
              yield "b";
              log("finished 1");
            } finally {
              log("finally 1");
            }
          }),
          mkIter(function*() {
            try {
              yield "c";
              yield "d";
              yield "e";
              yield "f";
              log("finished 2");
            } finally {
              log("finally 2");
            }
          })
        )
      );
    },
    ret: [["a", "c"], ["b", "d"]],
    log: ["finished 1", "finally 1", "finally 2"]
  });
}

type ZipImpl = <T>(...iterables: Iterable<T>[]) => AsyncIterable<T[]>;

async function throwInNext(zip: ZipImpl) {
  await assertMonitorAsync({
    fn(log) {
      return asyncIterableToArray(
        zip(
          mkIter(function*() {
            try {
              yield "a";
              yield "b";
              log("finish 1");
            } finally {
              log("finally 1");
            }
          }),
          mkIter(function*() {
            try {
              yield "c";
              throw "error 2";
            } finally {
              log("finally 2");
            }
          }),
          mkIter(function*() {
            try {
              yield "d";
              yield "e";
              log("finish 3");
            } finally {
              log("finally 3");
            }
          })
        )
      );
    },
    err: "error 2",
    log: ["finally 2", "finally 1", "finally 3"]
  });
}

async function throwInFinally(zip: ZipImpl) {
  await assertMonitorAsync({
    fn(log) {
      return asyncIterableToArray(
        zip(
          mkIter(function*() {
            try {
              yield "a";
              yield "b";
              log("finish 1");
            } finally {
              log("finally 1");
            }
          }),
          mkIter(function*() {
            try {
              yield "c";
              yield "d";
              log("finish 2");
            } finally {
              log("finally 2");
              throw "finally error 2";
            }
          }),
          mkIter(function*() {
            try {
              yield "e";
              // yield "f";
              log("finish 3");
            } finally {
              log("finally 3");
            }
          }),
          mkIter(function*() {
            try {
              yield "g";
              yield "h";
              log("finish 4");
            } finally {
              log("finally 4");
            }
          })
        )
      );
    },
    err: "finally error 2",
    log: ["finish 3", "finally 3", "finally 1", "finally 2", "finally 4"]
  });
}

async function rethrowOriginalError(zip: ZipImpl) {
  await assertMonitorAsync({
    fn(log) {
      return asyncIterableToArray(
        zip(
          mkIter(function*() {
            try {
              log("yield 1");
              yield "a";
              throw "error 1";
            } finally {
              log("finally 1");
            }
          }),
          mkIter(function*() {
            try {
              log("yield 2a");
              yield "a";
              log("yield 2b");
              yield "b";
              log("finish 2");
            } finally {
              log("finally 2");
              throw "error 2";
            }
          })
        )
      );
    },
    err: "error 1",
    log: ["yield 1", "yield 2a", "finally 1", "finally 2"]
  });
}

async function throwInReturnDoesntBlockOtherReturns(zip: ZipImpl) {
  assertMonitorAsync({
    fn(log) {
      return asyncIterableToArray(
        zip(
          mkIter(function*() {
            try {
              yield "a";
              yield "b";
              log("finish 1");
            } finally {
              log("finally 1");
              throw "error 1";
            }
          }),
          mkIter(function*() {
            try {
              yield "c";
              log("finish 2");
            } finally {
              log("finally 2");
            }
          }),
          mkIter(function*() {
            try {
              yield "d";
              yield "e";
              log("finish 3");
            } finally {
              log("finally 3");
              throw "error 3";
            }
          })
        )
      );
    },
    err: "error 1",
    log: ["finish 2", "finally 2", "finally 1", "finally 3"]
  });
}

async function inputIsForwarded(zip: ZipImpl) {
  assertMonitorAsync({
    async fn(log) {
      const it = zip(
        mkIter(function*() {
          log(yield "a");
          log(yield "b");
          log(yield "c");
          log("finish 1");
        }),
        mkIter(function*() {
          log(yield "d");
          log(yield "e");
          log(yield "f");
          log("finish 2");
        }),
        mkIter(function*() {
          log(yield "g");
          log(yield "h");
          log(yield "i");
          log("finish 3");
        })
      )[Symbol.asyncIterator]();
      return asyncIterableToArray(
        mkIterAsync(async function*() {
          let i = 0;
          while (true) {
            const { done, value } = await it.next(i++);
            if (done) {
              return;
            }
            yield value;
          }
        })
      );
    },
    log: [1, 1, 1, 2, 2, 2, 3, "finish 1"],
    ret: [["a", "d", "g"], ["b", "e", "h"], ["c", "f", "i"]]
  });
}

function delay(t: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}

function waitABit() {
  return delay(10);
}

async function asyncIsParallel() {
  await assertMonitorAsync({
    async fn(log) {
      const it = zipAsyncParallel(
        mkIterAsync(async function*() {
          try {
            log("1.1");
            await waitABit();
            log("1.2");
            yield "a";
            log("1.3");
            await waitABit();
            log("1.4");
            yield "b";
            log("1.5");
            await waitABit();
            log("1.6");
          } finally {
            log("1.7");
            await waitABit();
            log("1.8");
            await waitABit();
            log("1.9");
          }
        }),
        mkIterAsync(async function*() {
          try {
            log("2.1");
            await waitABit();
            log("2.2");
            yield "c";
            log("2.3");
            await waitABit();
            log("2.4");
            yield "d";
            log("2.5");
            await waitABit();
            log("2.6");
          } finally {
            log("2.7");
            await waitABit();
            log("2.8");
            await waitABit();
            log("2.9");
          }
        })
      );
      const ret = new Array<unknown>();
      for await (const x of it) {
        ret.push(x);
      }
      return ret;
    },
    ret: [["a", "c"], ["b", "d"]],
    log: [
      "1.1",
      "2.1",
      "1.2",
      "2.2",
      "1.3",
      "2.3",
      "1.4",
      "2.4",
      "1.5",
      "2.5",
      "1.6",
      "1.7",
      "2.6",
      "2.7",
      "1.8",
      "2.8",
      "1.9",
      "2.9"
    ]
  });
}

async function standardTests(zip: ZipImpl) {
  await basic(zip);
  await lengthIsShortest(zip);
  await loopMultipleTimes(zip);
  await finallyCalled(zip);
  await throwInNext(zip);
  await throwInFinally(zip);
  await rethrowOriginalError(zip);
  await throwInReturnDoesntBlockOtherReturns(zip);
  await inputIsForwarded(zip);
}

async function main() {
  await standardTests((...its) => iterableToAsyncIterable(zip(...its)));
  await standardTests((...its) => zipAsyncSequential(...its.map(iterableToAsyncIterable)));
  await asyncIsParallel();

  console.log("tests finished");
}

main();
