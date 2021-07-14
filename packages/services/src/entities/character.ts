import { makeEntity, makeUpdateEntity } from './validator.js';
import Hapi from 'joi';
import type { ReferenceTypes } from './constants';

export interface IAttribute {
  name: string;
  value: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface ISkill {
  name: string;
  value: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface IStats {
  health: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICharacteristics {}

export interface IVampireStats extends IStats {
  willpower: number;
  hunger: number;
  humanity: number;
}

export type IHumanStats = IStats;

export interface IVampireCharacteristics extends ICharacteristics {
  sire: string;
  predator: string;
  clan: string;
  generation: string;
}

export type Splat = 'vampire' | 'human';

export interface ICharacter<Characteristics extends ICharacteristics, Stats extends IStats> {
  id: string;
  referenceId?: string;
  // We only support discord for now
  referenceType: ReferenceTypes;
  chronicleId: string;
  name: string;
  concept: string;
  ambition: string;
  desire: string;
  splat: Splat;
  characteristics: Characteristics;
  // TODO: Do we want these explicit?
  attributes: {
    [name: string]: IAttribute;
  };
  // TODO: Do we want these explicit?
  skills: {
    [name: string]: ISkill;
  };
  stats: Stats;
  created: string;
  modified: string;
}

export type Vampire = ICharacter<IVampireCharacteristics, IVampireStats>;

export type Human = ICharacter<Record<string, string>, IHumanStats>;

export type Character = Vampire | Human;

export type CreateCharacterEntity = Pick<Vampire | Human, 'name' | 'splat' | 'chronicleId' | 'referenceType'>;
export type UpdateCharacterEntity = Partial<Character> & { id: string };

// This is only what is required to create, we will probably want another validation
// for locking a character in?
export const Validation = Hapi.object({
  referenceId: Hapi.string(),
  // TODO: I am not actually sure this should be required...
  referenceType: Hapi.string().required(),
  name: Hapi.string().required(),
  concept: Hapi.string(),
  ambition: Hapi.string(),
  desire: Hapi.string(),
  splat: Hapi.string().valid('vampire', 'human').required(),
  // For now this is required but this might not be later
  chronicleId: Hapi.string().required()
});

export const UpdateValidation = Hapi.object({
  id: Hapi.string().required(),
  // If name is being changed it needs to have some value
  name: Hapi.string().min(1),
  concept: Hapi.string(),
  ambition: Hapi.string(),
  desire: Hapi.string(),
  // if splat is being changed, it needs to have some value
  // TODO: maybe it doesn't make sense to allow this to be changed
  splat: Hapi.string().valid('vampire', 'human').min(1)
});

/**
 * Creates a Character entity.  A character is any player or non-player character in the game.
 */
export const createCharacterEntity = makeEntity(Validation);

export const updateCharacterEntity = makeUpdateEntity(UpdateValidation);
