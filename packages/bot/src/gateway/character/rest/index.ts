import {
  type CharacterGateway,
  type CreateCharacter,
  type GetCharacter,
  type ListCharacter,
  type UpdateCharacter,
} from '../types'
import { type Character } from '../../../entity/character.js'
import { type Rest } from '../../../service/rest/types.js'

/**
 * Creates a new character
 * @param db
 */
export const createCharacter =
  (options: Rest): CreateCharacter =>
  (c) =>
    c.asyncAndThen<Character, string>(
      options.post('http://services:5101/characters')
    )

/**
 * Fetches an existing character
 * @param options
 * @returns
 */
export const getCharacter = (options: Rest): GetCharacter =>
  options.get<Character>(`http://services:5101/characters`)

export const updateCharacter =
  (options: Rest): UpdateCharacter =>
  (character) =>
    character.asyncAndThen<Character, string>((c) =>
      options.patch(`http://services:5101/characters/${c.id}`)(c)
    )

export const listCharacters = (options: Rest): ListCharacter =>
  options.list<Character>(`http://services:5101/characters`)

/**
 * Complete gateway for accessing chracter data
 * @param db
 */
export const characterGateway = (options: Rest): CharacterGateway => ({
  create: createCharacter(options),
  get: getCharacter(options),
  list: listCharacters(options),
  update: updateCharacter(options),
})
