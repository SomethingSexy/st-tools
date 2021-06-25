export const atLeastOne = <T>(x: T[]) => Array.isArray(x) && x.length > 0;

export const head = <T>(x: T[]) => (atLeastOne(x) ? x[0] : null);

export const mapAll = <T, R>(f: (value: T, index: number, array: T[]) => R) => (x : T[]) => x.map(f); 