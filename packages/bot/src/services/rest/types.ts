import { FutureInstance } from 'fluture';

export type Post = (url: string) => <R, T extends object>(b: T) => FutureInstance<string, R>;

export interface Rest {
  get: <T>(url: string) => () => Promise<T>;
  post: Post;
}
