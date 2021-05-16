export const isString = (x?: any): x is string => typeof x === 'string';

export const endsWith = (searchString: string) => (s: string) => s.endsWith(searchString);
