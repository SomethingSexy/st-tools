import { object, ObjectSchema, string } from '@hapi/joi';
import S from 'sanctuary';
import { Either } from '../utils/sanctuary';

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

export interface ICharacteristics {}

export interface IVampireStats extends IStats {
  willpower: number;
  hunger: number;
  humanity: number;
}

export interface IHumanStats extends IStats {}

export interface IVampireCharacteristics extends ICharacteristics {
  sire: string;
  predator: string;
  clan: string;
  generation: string;
}

export type Splat = 'vampire' | 'human';

export interface ICharacter<Characteristics extends ICharacteristics, Stats extends IStats> {
  id: string;
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

export type Human = ICharacter<{}, IHumanStats>;

export type Character = Vampire | Human;

// This is only what is required to create, we will probably want another validation
// for locking a character in?
export const Validation = object({
  name: string().required(),
  concept: string(),
  ambition: string(),
  desire: string(),
  splat: string().valid('vampire', 'human').required()
});

export type CreateCharacterEntity = Pick<Vampire | Human, 'name' | 'splat'>;

export const makeCreateCharacterEntity = (schema: ObjectSchema) => (
  c: CreateCharacterEntity
): Either<string, CreateCharacterEntity> => {
  const { error, value } = schema.validate(c);
  return error ? S.Left(error.message) : S.Right(value);
};

/**
 * Creates a Character entity.  A character is any player or non-player character in the game.
 */
export const createCharacterEntity = makeCreateCharacterEntity(Validation);
