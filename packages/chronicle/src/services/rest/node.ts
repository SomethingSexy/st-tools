import { attemptP, chain, FutureInstance } from 'fluture';
import fetch from 'node-fetch';
import type { Rest } from './types';

export const get = (url: string) => () => {
  return fetch(url)
    .then(r => {
      if (r.ok) {
        return r.json();
      }
    })
}

export const post = (url: string) => <R, T extends object>(b: T) => {
    return attemptP<string, R>(() => {
      return fetch(url, {
        method: 'post',
        body: JSON.stringify(b),
        headers: { 'Content-Type': 'application/json' },
      })
      .then(r => {
        if (r.ok) {
          return r.json()
        } else {
          return Promise.reject(r.statusText);
        }
      })
    })

}

export const rest: Rest = {
  get,
  post
}