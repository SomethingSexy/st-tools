import { expect, test } from 'vitest'
import { compose } from '../function.js'

test('it should work with a single function', () => {
  expect(compose((a: number) => a + 1)(2)).toEqual(3)
})
