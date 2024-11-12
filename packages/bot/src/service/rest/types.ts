import { type ResultAsync } from 'neverthrow'

export type Post = (url: string) => FetchPost

export type FetchPost = <R, T extends { id: string }>(
  b: T
) => ResultAsync<R, string>

export type Get = <R>(url: string) => (id: string) => ResultAsync<R, string>

export type List = <R>(
  url: string
) => (filters?: { id?: string }) => ResultAsync<R[], string>

export type Patch = (
  url: string
) => <R, T extends { id: string }>(b: T) => ResultAsync<R, string>

export interface Rest {
  get: Get
  list: List
  patch: Patch
  post: Post
}
