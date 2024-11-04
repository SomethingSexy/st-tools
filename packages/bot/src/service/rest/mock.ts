// Mock functions for testing without using core backend
import { errAsync, okAsync } from 'neverthrow'
import { Rest } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = new Map<string, any>()

export const mock: Rest = {
  get: (url) => () => {
    // pivot based on url
    const item = cached.get(url)
    return item ? okAsync(item) : errAsync('Item could not be found')
  },
  post: (url: string) => (b) => {
    const key = `${url}/${b.id}`
    cached.set(key, b)

    return okAsync(cached.get(key))
  },
}
