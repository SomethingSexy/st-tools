import Ajv, { Schema } from 'ajv'
import { type Validate, validate } from './validator.js'
import { type Result } from 'neverthrow'

const ajv = new Ajv()

const chronicleSchema: Schema = {
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
    game: {
      type: 'string',
      enum: ['vtm'],
    },
    version: {
      type: 'string',
      enum: ['v5'],
    },
  },
  required: [
    'name',
    'referenceId',
    'referenceType',
    'game',
    'version',
    'userId',
  ],
}

const validateChronicle = ajv.compile(chronicleSchema)

export interface Chronicle {
  description?: string
  game: string
  id: string
  name: string
  referenceId: string
  // We only support discord for now
  referenceType: 'discord'
  // We only support vtm and v5 for now
  version: string
  userId: string
  created: string
  modified: string
}

export type CreateChronicleEntity = Pick<
  Chronicle,
  | 'id'
  | 'name'
  | 'referenceId'
  | 'game'
  | 'version'
  | 'referenceType'
  | 'userId'
>

export type CreateChronicleRequest = Pick<
  CreateChronicleEntity,
  'name' | 'referenceId' | 'game' | 'version' | 'referenceType' | 'userId'
>

export type GetChronicleRequest = Pick<
  Chronicle,
  'referenceId' | 'referenceType'
>

const validateChronicleEntity = validate(validateChronicle)

export const makeChronicleEntity =
  (validator: Validate) =>
  (c: CreateChronicleRequest): Result<CreateChronicleEntity, string> =>
    validator(c).map(addId)

export const chronicleEntity = makeChronicleEntity(validateChronicleEntity)

export const buildChronicleId = ({
  referenceId,
  referenceType,
}: Pick<Chronicle, 'referenceId' | 'referenceType'>): string =>
  `${referenceType}:${referenceId}`

const addId = (chronicle: CreateChronicleRequest): CreateChronicleEntity => ({
  ...chronicle,
  id: buildChronicleId(chronicle),
})
