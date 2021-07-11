import Hapi from 'joi';
import type { ReferenceTypes } from './constants.js';
import { makeEntity } from './validator.js';

// const { alternatives, object, string, number } = hapi;

// TODO: Location?
export interface Chronicle {
  name: string;
  id: string;
  referenceId: string;
  // We only support discord for now
  referenceType: ReferenceTypes;
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

export const createChronicleEntity = makeEntity(Validation);
