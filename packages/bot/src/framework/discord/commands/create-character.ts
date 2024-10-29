import { type ICommand } from '../types'
import { okAsync } from 'neverthrow'

export default {
  name: 'create-character',
  description: 'Creates a character',
  title: 'Create Character',
  execute: () => {
    return okAsync('foo')
  },
} as ICommand
