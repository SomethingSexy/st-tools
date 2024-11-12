import {
  type Character,
  type CreateCharacterEntity,
} from '../../entity/character.js'
import { type Result, type ResultAsync } from 'neverthrow'

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type CreateCharacter = (
  character: Result<CreateCharacterEntity, string>
) => ResultAsync<Character, string>

export type GetCharacter = (id: string) => ResultAsync<Character, string>

export type UpdateCharacter = (
  character: Result<WithRequired<Partial<CreateCharacterEntity>, 'id'>, string>
) => ResultAsync<Character, string>

// TODO: Add filtering point to this function when needed
export type ListCharacter = () => ResultAsync<Character[], string>

export interface CharacterGateway {
  create: CreateCharacter
  get: GetCharacter
  list: ListCharacter
  update: UpdateCharacter
}
