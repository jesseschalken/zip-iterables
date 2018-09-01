export declare function asyncIterToArray<T>(xs: AsyncIterable<T>): Promise<T[]>;
export declare function iterToAsync<T>(iterable: Iterable<T> | Promise<Iterable<T>>): AsyncIterable<T>;
export declare const zip: {
    (): Iterable<[]>;
    <A>(a: Iterable<A>): Iterable<[A]>;
    <A, B>(a: Iterable<A>, b: Iterable<B>): Iterable<[A, B]>;
    <A, B, C>(a: Iterable<A>, b: Iterable<B>, c: Iterable<C>): Iterable<[A, B, C]>;
    <A, B, C, D>(a: Iterable<A>, b: Iterable<B>, c: Iterable<C>, d: Iterable<D>): Iterable<[A, B, C, D]>;
    <A, B, C, D, E>(a: Iterable<A>, b: Iterable<B>, c: Iterable<C>, d: Iterable<D>, e: Iterable<E>): Iterable<[A, B, C, D, E]>;
    <A, B, C, D, E, F>(a: Iterable<A>, b: Iterable<B>, c: Iterable<C>, d: Iterable<D>, e: Iterable<E>, f: Iterable<F>): Iterable<[A, B, C, D, E, F]>;
    <T>(...iterables: Iterable<T>[]): Iterable<T[]>;
};
export declare const zipAsync: {
    (): AsyncIterable<[]>;
    <A>(a: AsyncIterable<A>): AsyncIterable<[A]>;
    <A, B>(a: AsyncIterable<A>, b: AsyncIterable<B>): AsyncIterable<[A, B]>;
    <A, B, C>(a: AsyncIterable<A>, b: AsyncIterable<B>, c: AsyncIterable<C>): AsyncIterable<[A, B, C]>;
    <A, B, C, D>(a: AsyncIterable<A>, b: AsyncIterable<B>, c: AsyncIterable<C>, d: AsyncIterable<D>): AsyncIterable<[A, B, C, D]>;
    <A, B, C, D, E>(a: AsyncIterable<A>, b: AsyncIterable<B>, c: AsyncIterable<C>, d: AsyncIterable<D>, e: AsyncIterable<E>): AsyncIterable<[A, B, C, D, E]>;
    <A, B, C, D, E, F>(a: AsyncIterable<A>, b: AsyncIterable<B>, c: AsyncIterable<C>, d: AsyncIterable<D>, e: AsyncIterable<E>, f: AsyncIterable<F>): AsyncIterable<[A, B, C, D, E, F]>;
    <T>(...iterables: AsyncIterable<T>[]): AsyncIterable<T[]>;
};
export declare const zipAsyncSequential: {
    (): AsyncIterable<[]>;
    <A>(a: AsyncIterable<A>): AsyncIterable<[A]>;
    <A, B>(a: AsyncIterable<A>, b: AsyncIterable<B>): AsyncIterable<[A, B]>;
    <A, B, C>(a: AsyncIterable<A>, b: AsyncIterable<B>, c: AsyncIterable<C>): AsyncIterable<[A, B, C]>;
    <A, B, C, D>(a: AsyncIterable<A>, b: AsyncIterable<B>, c: AsyncIterable<C>, d: AsyncIterable<D>): AsyncIterable<[A, B, C, D]>;
    <A, B, C, D, E>(a: AsyncIterable<A>, b: AsyncIterable<B>, c: AsyncIterable<C>, d: AsyncIterable<D>, e: AsyncIterable<E>): AsyncIterable<[A, B, C, D, E]>;
    <A, B, C, D, E, F>(a: AsyncIterable<A>, b: AsyncIterable<B>, c: AsyncIterable<C>, d: AsyncIterable<D>, e: AsyncIterable<E>, f: AsyncIterable<F>): AsyncIterable<[A, B, C, D, E, F]>;
    <T>(...iterables: AsyncIterable<T>[]): AsyncIterable<T[]>;
};
