import Hapi, { ObjectSchema } from 'joi';
import { Either, S } from '../utils/sanctuary.js';

// const { alternatives, object, string, number } = hapi;

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
export type GetChronicleEntity = Pick<Chronicle, 'id'>;

export const Validation = Hapi.object({
  name: Hapi.string().required(),
  referenceId: Hapi.alternatives(Hapi.string(), Hapi.number()).required(),
  referenceType: Hapi.string().valid('discord').required(),
  game: Hapi.string().valid('vtm').required(),
  version: Hapi.string().valid('v5').required()
});

export const makeCreateChronicleEntity =
  (schema: ObjectSchema) =>
  (c: CreateChronicleEntity): Either<string, CreateChronicleEntity> => {
    const { error, value } = schema.validate(c);
    return error ? S.Left(error.message) : S.Right(value);
  };

export const createChronicleEntity = makeCreateChronicleEntity(Validation);
