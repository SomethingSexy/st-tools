import Joi, { ObjectSchema } from '@hapi/joi';
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
}

export type CreateChronicleEntity = Pick<Chronicle, 'name' | 'referenceId' | 'game' | 'version' | 'referenceType'>;

export const Validation = Joi.object({
  name: Joi.string().required(),
  referenceId: Joi.alternatives(Joi.string(), Joi.number()).required(),
  referenceType: Joi.string().valid('discord').required(),
  game: Joi.string().valid('vtm').required(),
  version: Joi.string().valid('v5').required()
});

export const makeCreateChronicleEntity = (schema: ObjectSchema) => (
  c: CreateChronicleEntity
): Either<any, CreateChronicleEntity> => {
  const { error, value } = schema.validate(c);
  return error ? S.Left(error) : S.Right(value);
};

export const createChronicleEntity = makeCreateChronicleEntity(Validation);
