export const isNothing = <T>(x: T) => typeof x === 'undefined' || x === null;
export const isJust = <T>(x: T) => !isNothing(x);
