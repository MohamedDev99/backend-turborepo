export type Prettify<T> = {
    [K in keyof T]: T[K] extends Array<infer U>
        ? Array<Prettify<U>>
        : T[K] extends ReadonlyArray<infer U>
          ? ReadonlyArray<Prettify<U>>
          : Prettify<T[K]>;
} & {};
