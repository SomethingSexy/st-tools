import { type ResultAsync } from 'neverthrow'

export type Post = (url: string) => FetchPost

export type FetchPost = <R, T extends { id: string }>(
  b: T
) => ResultAsync<R, string>

export type Get = <R>(url: string) => () => ResultAsync<R, string>

export interface Rest {
  get: Get
  post: Post
}
