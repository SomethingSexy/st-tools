import { type ResultAsync } from 'neverthrow'

export type Post = (url: string) => FetchPost

export type FetchPost = <R, T extends object>(b: T) => ResultAsync<R, string>

export interface Rest {
  get: <T>(url: string) => () => Promise<T>
  post: Post
}
