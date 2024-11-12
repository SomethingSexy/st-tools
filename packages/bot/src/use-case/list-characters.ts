import { type Gateways } from '../gateway/index.js'

export const listCharacters =
  ({ character }: Gateways) =>
  () => {
    return character.list()
  }
