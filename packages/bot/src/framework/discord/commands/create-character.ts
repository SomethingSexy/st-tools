import type { ICommand } from '../types'
import { resolve } from 'fluture'

export default {
  name: 'create-character',
  description: 'Creates a character',
  title: 'Create Character',
  execute: () => {
    return resolve('foo')
  },
} as ICommand
