export const atLeastOne = <T>(x: T[]) => Array.isArray(x) && x.length > 0

export const join =
  (separator?: string) =>
  <T>(x?: T[]): string =>
    x?.join(separator) ?? ''
export const joinNewline = join('\n')
