// Mock functions for testing without using core backend
import { errAsync, okAsync } from 'neverthrow'
import { Rest } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = new Map<string, Map<string, any>>()

export const mock: Rest = {
  get: (url) => (id) => {
    const items = cached.get(url)

    if (!items) {
      return errAsync('No items at url')
    }

    if (!id) {
      return errAsync('Id is required')
    }

    const item = items.get(id)
    return item ? okAsync(item) : errAsync('Item could not be found')
  },
  post: (url: string) => (b) => {
    cached.set(url, new Map([[b.id, b]]))

    return okAsync(cached.get(url).get(b.id))
  },
  patch: (url: string) => (b) => {
    const items = cached.get(url)
    const prev = items.get(b.id)
    items.set(b.id, {
      ...prev,
      b,
    })

    return okAsync(cached.get(url).get(b.id))
  },
  list: (url: string) => () => {
    const results = cached.get(url)
    if (!results) {
      return okAsync([])
    }

    const values = results.values()
    if (!values) {
      return okAsync([])
    }

    return okAsync(Array.from(values))
  },
}
