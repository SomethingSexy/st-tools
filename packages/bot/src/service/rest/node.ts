import { type FetchPost, type Rest } from './types'
import { fromAsyncThrowable } from 'neverthrow'

export const get = (url: string) => () =>
  fetch(url).then((r) => {
    if (r.ok) {
      return r.json()
    }
  })

const post = (url: string) => (b: object) =>
  fetch(url, {
    method: 'post',
    body: JSON.stringify(b),
    headers: { 'Content-Type': 'application/json' },
  }).then(async (r) => {
    if (r.ok) {
      return r.json()
    } else {
      return Promise.reject(await r.text())
    }
  })

export const rest: Rest = {
  get,
  // TODO: This is probably a string or an error
  post: (url: string): FetchPost =>
    fromAsyncThrowable(post(url), (e: string) => e),
}
