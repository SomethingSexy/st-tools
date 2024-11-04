import Ajv, { Schema } from 'ajv'
import { type Result, err, ok } from 'neverthrow'

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

export const makeCreateChronicleEntity = (
  c: CreateChronicleRequest
): Result<CreateChronicleEntity, string> => {
  const valid = validateChronicle(c)

  const chronicleWithId = {
    ...c,
    id: buildChronicleId(c),
  }

  return !valid
    ? err(validateChronicle.errors.map((e) => e.message).join())
    : ok(chronicleWithId)
}

export const createChronicleEntity = makeCreateChronicleEntity

export const buildChronicleId = ({
  referenceId,
  referenceType,
}: Pick<Chronicle, 'referenceId' | 'referenceType'>): string =>
  `${referenceType}:${referenceId}`
