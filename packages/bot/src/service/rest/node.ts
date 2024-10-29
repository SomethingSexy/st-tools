import type { Rest } from './types'
import { attemptP } from 'fluture'
import fetch from 'node-fetch'

export const get = (url: string) => () => {
  return fetch(url).then((r) => {
    if (r.ok) {
      return r.json()
    }
  })
}

export const post =
  (url: string) =>
  <R, T extends object>(b: T) => {
    return attemptP<string, R>(() => {
      return fetch(url, {
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
    })
  }

export const rest: Rest = {
  get,
  post,
}
