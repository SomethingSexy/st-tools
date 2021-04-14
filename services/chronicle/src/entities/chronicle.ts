import { ObjectSchema, alternatives, object, string, number } from '@hapi/joi';
import { Either, S } from '../utils/sanctuary';

// TODO: Location?
export interface Chronicle {
  name: string;
  id: string;
  referenceId: string;
  // We only support discord for now
  referenceType: 'discord';
  // We only support vtm and v5 for now
  game: 'vtm';
  version: 'v5';
  created: string;
  modified: string;
}

export type CreateChronicleEntity = Pick<Chronicle, 'name' | 'referenceId' | 'game' | 'version' | 'referenceType'>;

export const Validation = object({
  name: string().required(),
  referenceId: alternatives(string(), number()).required(),
  referenceType: string().valid('discord').required(),
  game: string().valid('vtm').required(),
  version: string().valid('v5').required()
});

export const makeCreateChronicleEntity = (schema: ObjectSchema) => (
  c: CreateChronicleEntity
): Either<string, CreateChronicleEntity> => {
  const { error, value } = schema.validate(c);
  return error ? S.Left(error.message) : S.Right(value);
};

export const createChronicleEntity = makeCreateChronicleEntity(Validation);
