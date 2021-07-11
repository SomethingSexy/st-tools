import { FutureInstance, attemptP, chain, map, reject, resolve } from 'fluture';
import { Knex } from 'knex';
import type { Character, CreateCharacterEntity, Splat, UpdateCharacterEntity } from '../../../entities/character';
import type { ReferenceTypes } from '../../../entities/constants';
import { atLeastOne, head, mapAll } from '../../../utils/array.js';
import { compose } from '../../../utils/function.js';
import { pick } from '../../../utils/object.js';
import { eitherToFuture } from '../../../utils/sanctuary.js';
import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
import { create } from '../../crud.js';
import type { CharacterGateway, GetCharacter, UpdateCharacter } from '../types';

export const CHARACTER_TABLE_NAME = 'name';
export const CHARACTER_TABLE_SPLAT = 'splat';
export const CHARACTER_TABLE = 'character';
export const CHARACTER_CHRONICLE_ID = 'chronicle_id';
export const CHARACTER_TABLE_REFERENCE_ID = 'referenceId';
export const CHARACTER_TABLE_REFERENCE_TYPE = 'referenceType';
export const CHARACTER_TABLE_ID = TABLE_ID;

const updateKeys = pick(['name', 'concept', 'ambition', 'desire', 'splat']);
const searchFields = [CHARACTER_TABLE_REFERENCE_ID, CHARACTER_TABLE_ID] as const;

/**
 * This represents the raw format of the chronicle when selected from the table directly
 */
interface RetrievedCharacter {
  id: string;
  referenceId?: string;
  referenceType: ReferenceTypes;
  name: string;
  chronicleId: string;
  concept: string;
  ambition: string;
  desire: string;
  splat: string;
  created_at: string;
  updated_at: string;
}

const mapRetrievedToEntity = (chronicle: RetrievedCharacter): Character =>
  chronicle
    ? {
        id: chronicle.id,
        referenceId: chronicle.referenceId,
        referenceType: chronicle.referenceType,
        name: chronicle.name,
        chronicleId: chronicle[CHARACTER_CHRONICLE_ID],
        concept: chronicle.concept,
        ambition: chronicle.ambition,
        desire: chronicle.desire,
        splat: chronicle.splat as Splat,
        created: chronicle.created_at,
        modified: chronicle.updated_at,
        // TODO: merge/apply defaults
        characteristics: {},
        stats: {
          health: 0
        },
        attributes: {},
        skills: {}
      }
    : null;

const mapAllRetrieved = mapAll(mapRetrievedToEntity);

const retrievedToEntity: (chronicle: RetrievedCharacter[]) => Character = compose(mapRetrievedToEntity, head);

const insertAndReturnCharacter = (db: Knex) => (c: CreateCharacterEntity) => {
  return attemptP<string, RetrievedCharacter[]>(() => {
    const now = db.fn.now();
    return db(CHARACTER_TABLE)
      .insert({
        [CHARACTER_TABLE_NAME]: c.name,
        [CHARACTER_TABLE_SPLAT]: c.splat,
        [CHARACTER_TABLE_REFERENCE_TYPE]: c.referenceType,
        [CHARACTER_CHRONICLE_ID]: c.chronicleId,
        [CREATED_AT]: now,
        [MODIFIED_AT]: now
      })
      .returning([CHARACTER_TABLE_ID, CHARACTER_TABLE_NAME, CHARACTER_TABLE_SPLAT, CREATED_AT, MODIFIED_AT]);
  });
};

const updateAndReturnCharacter = (db: Knex) => (c: UpdateCharacterEntity) => {
  return attemptP<string, RetrievedCharacter[]>(() => {
    // This needs to figure out the exact properties that we are trying to update
    // and make changes to them.  It should only update what is provided.
    const now = db.fn.now();
    return db(CHARACTER_TABLE)
      .where({ id: c.id })
      .update(updateKeys(c))
      .returning([CHARACTER_TABLE_ID, CHARACTER_TABLE_NAME, CHARACTER_TABLE_SPLAT, CREATED_AT, MODIFIED_AT]);
  });
};

const findAllCharacters =
  (db: Knex) =>
  ({ chronicleId }: { chronicleId: string }) => {
    return attemptP<string, RetrievedCharacter[]>(() => {
      return db(CHARACTER_TABLE)
        .where({ [CHARACTER_CHRONICLE_ID]: chronicleId })
        .returning([
          CHARACTER_TABLE_ID,
          CHARACTER_TABLE_NAME,
          CHARACTER_TABLE_SPLAT,
          CREATED_AT,
          MODIFIED_AT,
          CHARACTER_CHRONICLE_ID
        ]);
    });
  };

const findCharacterById =
  (db: Knex) =>
  ({ id }: { id: string }) =>
    attemptP<string, Array<{ id: string }>>(() => {
      return db
        .select([CHARACTER_TABLE_ID])
        .from(CHARACTER_TABLE)
        .where({
          [CHARACTER_TABLE_ID]: id
        });
    });

const hasCharacterBy =
  <T>(f: (db: Knex) => (data: T) => FutureInstance<string, Array<{ id: string }>>) =>
  (db: Knex) =>
  (data: T) =>
    f(db)(data).pipe(map(atLeastOne));

const getCharacterBy =
  (by: typeof searchFields[number]) =>
  (db: Knex): GetCharacter =>
  (id) =>
    attemptP<string, RetrievedCharacter[]>(() =>
      db
        .select([
          CHARACTER_TABLE_ID,
          CHARACTER_TABLE_REFERENCE_ID,
          CHARACTER_TABLE_REFERENCE_TYPE,
          CHARACTER_TABLE_NAME,
          CHARACTER_TABLE_SPLAT,
          CREATED_AT,
          MODIFIED_AT
        ])
        .from(CHARACTER_TABLE)
        .where({
          [by]: id
        })
    )
      .pipe(map(retrievedToEntity))
      .pipe(chain((x) => (x === null ? reject('Character not found.') : resolve(x))));

export const hasChronicleById = hasCharacterBy(findCharacterById);

export const getCharacter = getCharacterBy(CHARACTER_TABLE_REFERENCE_ID);
export const getCharacterById = getCharacterBy(CHARACTER_TABLE_ID);

export const createCharacter =
  create<CreateCharacterEntity, RetrievedCharacter, Character>(insertAndReturnCharacter)(retrievedToEntity);

export const updateCharacter =
  (db: Knex): UpdateCharacter =>
  (c) =>
    eitherToFuture(c)
      .pipe(chain(updateAndReturnCharacter(db)))
      .pipe(map(retrievedToEntity));

/**
 * Retrieves all characters for a given chronicle.  This can be updated in the future to
 * support filtering, paging, and sorting.
 * @param db
 * @returns
 */
export const getCharacters = (db: Knex) => (data: { chronicleId: string }) => {
  return findAllCharacters(db)(data).pipe(map(mapAllRetrieved));
};

export const characterGateway = (db: Knex): CharacterGateway => ({
  create: createCharacter(db),
  getCharacterById: getCharacterById(db),
  getCharacters: getCharacters(db),
  update: updateCharacter(db)
});
