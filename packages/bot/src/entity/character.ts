import Ajv, { type Schema } from 'ajv'
import { type Validate, validate } from './validator.js'
import { type Result } from 'neverthrow'
import { v4 } from 'uuid'

const ajv = new Ajv()

const characterSchema: Schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    referenceId: {
      type: 'string',
    },
    referenceType: {
      type: 'string',
      enum: ['discord'],
    },
  },
  required: ['name'],
}

const validateCharacter = ajv.compile(characterSchema)
const validateCharacterEntity = validate(validateCharacter)

export interface Character {
  id: string
  name: string
  referenceId: string
  referenceType: string
}
export type CreateCharacterEntity = Pick<
  Character,
  'id' | 'name' | 'referenceId' | 'referenceType'
>

export type CreateCharacterRequest = Pick<
  CreateCharacterEntity,
  'name' | 'referenceId' | 'referenceType'
>

const addId = (character: CreateCharacterRequest): CreateCharacterEntity => ({
  ...character,
  id: character.referenceId
    ? `${character.referenceType}:${character.referenceId}`
    : // TODO: WE need to remove this from here and pass it in
      `uuid:${v4()}`,
})

const makeCharacterEntity =
  (validate: Validate) =>
  (character: CreateCharacterRequest): Result<CreateCharacterEntity, string> =>
    validate(character).map(addId)

export const characterEntity = makeCharacterEntity(validateCharacterEntity)
