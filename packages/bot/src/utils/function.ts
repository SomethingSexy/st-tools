export function compose<A, B>(f2: (a: A) => B): (a: A) => B
export function compose<A, B, C>(f1: (b: B) => C, f2: (a: A) => B): (a: A) => C
export function compose<A, B, C, D>(
  f1: (b: C) => D,
  f2: (a: B) => C,
  f3: (a: A) => B
): (a: A) => D
export function compose<A, B, C, D, E>(
  f1: (b: D) => E,
  f2: (a: C) => D,
  f3: (a: B) => C,
  f4: (a: A) => B
): (a: A) => E

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function compose(...fns: Function[]) {
  return <T>(payload: T) => {
    return fns.reduceRight((v, fn) => {
      return fn(v)
    }, payload)
  }
}
