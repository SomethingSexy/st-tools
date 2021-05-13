import { attemptP, chain, map } from 'fluture';
import Knex from 'knex';
import type { CreateChronicleEntity } from '../../../entities/chronicle';
import { atLeastOne } from '../../../utils/array.js';
import { eitherToFuture } from '../../../utils/sanctuary.js';
import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
import type { ChronicleExistsByReference, ChronicleGateway, CreateChronicle, GetChronicle } from '../types';

/**
 * This represents the raw format of the chronicle when selected from the table directly
 */
interface RetrievedChronicle {
  name: string;
  id: string;
  referenceId: string;
  referenceType: 'discord';
  game: 'vtm';
  version: 'v5';
  created_at: string;
  updated_at: string;
}

const CHRONICLE_TABLE = 'chronicle';
export const CHRONICLE_TABLE_NAME = 'name';
export const CHRONICLE_TABLE_REFERENCE_ID = 'referenceId';
export const CHRONICLE_TABLE_ID = TABLE_ID;
export const CHRONICLE_TABLE_GAME = 'game';
export const CHRONICLE_TABLE_VERSION = 'version';
export const CHRONICLE_TABLE_REFERENCE_TYPE = 'referenceType';

const searchFields = [CHRONICLE_TABLE_REFERENCE_ID, CHRONICLE_TABLE_ID] as const;

const retrievedToEntity = (chronicle: RetrievedChronicle[]) => ({
  id: chronicle[0].id,
  referenceId: chronicle[0].referenceId,
  referenceType: chronicle[0].referenceType,
  name: chronicle[0].name,
  game: chronicle[0].game,
  version: chronicle[0].version,
  created: chronicle[0].created_at,
  modified: chronicle[0].updated_at
});

// TODO: Long term this is probably not a good idea, having to do this for every single request.
const createTable = (db: Knex) => <T>(data: T) =>
  attemptP<string, T>(() =>
    db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() =>
      db.schema.hasTable(CHRONICLE_TABLE).then((exists) => {
        if (!exists) {
          return db.schema
            .createTable(CHRONICLE_TABLE, (table) => {
              table.string(CHRONICLE_TABLE_REFERENCE_ID);
              table.string(CHRONICLE_TABLE_NAME);
              table.string(CHRONICLE_TABLE_VERSION);
              table.string(CHRONICLE_TABLE_GAME);
              table.string(CHRONICLE_TABLE_REFERENCE_TYPE);
              table.uuid(CHRONICLE_TABLE_ID).defaultTo(db.raw('uuid_generate_v4()'));
              table.index([CHRONICLE_TABLE_REFERENCE_ID, CHRONICLE_TABLE_ID]);
              table.timestamps();
            })
            .then(() => data);
        }
        return Promise.resolve(data);
      })
    )
  );

const insertAndReturnChronicle = (db: Knex) => (c: CreateChronicleEntity) =>
  attemptP<string, RetrievedChronicle[]>(() => {
    const now = db.fn.now();
    return db(CHRONICLE_TABLE)
      .insert({
        [CHRONICLE_TABLE_NAME]: c.name,
        [CHRONICLE_TABLE_REFERENCE_ID]: c.referenceId,
        [CHRONICLE_TABLE_VERSION]: c.version,
        [CHRONICLE_TABLE_GAME]: c.game,
        [CHRONICLE_TABLE_REFERENCE_TYPE]: c.referenceType,
        [CREATED_AT]: now,
        [MODIFIED_AT]: now
      })
      .returning([
        CHRONICLE_TABLE_ID,
        CHRONICLE_TABLE_REFERENCE_ID,
        CHRONICLE_TABLE_REFERENCE_TYPE,
        CHRONICLE_TABLE_NAME,
        CHRONICLE_TABLE_GAME,
        CHRONICLE_TABLE_VERSION,
        CREATED_AT,
        MODIFIED_AT
      ]);
  });

const findChronicle = (db: Knex) => ({ id, type }: { id: string; type: string }) =>
  attemptP<string, Array<{ id: string }>>(() => {
    return db
      .select(CHRONICLE_TABLE_ID)
      .from(CHRONICLE_TABLE)
      .where({
        [CHRONICLE_TABLE_REFERENCE_ID]: id,
        [CHRONICLE_TABLE_REFERENCE_TYPE]: type
      });
  });

/**
 * Creates a new chronicle
 * @param db
 */
export const createChronicle = (db: Knex): CreateChronicle => (c) =>
  eitherToFuture(c)
    .pipe(chain(createTable(db)))
    .pipe(chain(insertAndReturnChronicle(db)))
    .pipe(map(retrievedToEntity));

/**
 * Determines if a chronicle already exists given the type and reference id.
 * @param db
 */
export const hasChronicleByReference = (db: Knex): ChronicleExistsByReference => (type) => (id) =>
  createTable(db)({ type, id })
    .pipe(chain(findChronicle(db)))
    .pipe(map(atLeastOne));

const getChronicleBy = (by: typeof searchFields[number]) => (db: Knex): GetChronicle => (id) =>
  createTable(db)(id)
    .pipe(
      chain((id) =>
        attemptP<string, RetrievedChronicle[]>(() =>
          db
            .select([
              CHRONICLE_TABLE_ID,
              CHRONICLE_TABLE_REFERENCE_ID,
              CHRONICLE_TABLE_REFERENCE_TYPE,
              CHRONICLE_TABLE_NAME,
              CHRONICLE_TABLE_GAME,
              CHRONICLE_TABLE_VERSION,
              CREATED_AT,
              MODIFIED_AT
            ])
            .from(CHRONICLE_TABLE)
            .where({
              [by]: id
            })
        )
      )
    )
    .pipe(map(retrievedToEntity));

export const getChronicle = getChronicleBy(CHRONICLE_TABLE_REFERENCE_ID);
export const getChronicleById = getChronicleBy(CHRONICLE_TABLE_ID);

/**
 * Complete gateway for accessing chronicle data from a postgres database
 * @param db
 */
export const chronicleGateway = (db: Knex): ChronicleGateway => {
  return {
    create: createChronicle(db),
    existsByReference: hasChronicleByReference(db),
    getChronicle: getChronicle(db)
  };
};
