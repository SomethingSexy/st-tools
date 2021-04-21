import { attemptP, chain, map } from 'fluture';
import Knex from 'knex';
import { atLeastOne } from '../../../utils/array';
import { eitherToFuture } from '../../../utils/sanctuary';
import { ChronicleExistsByReference, ChronicleGateway, CreateChronicle, GetChronicle } from '../types';

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
export const CHRONICLE_TABLE_ID = 'id';
export const CHRONICLE_TABLE_GAME = 'game';
export const CHRONICLE_TABLE_VERSION = 'version';
export const CHRONICLE_TABLE_REFERENCE_TYPE = 'referenceType';
export const CREATED_AT = 'created_at';
export const MODIFIED_AT = 'updated_at';

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
const createTable = (db: Knex) => {
  return db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => {
    return db.schema.hasTable(CHRONICLE_TABLE).then((exists) => {
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
          .then(() => db);
      }
      return Promise.resolve(db);
    });
  });
};

/**
 * Creates a new chronicle
 * @param db
 */
export const createChronicle = (db: Knex): CreateChronicle => (c) =>
  eitherToFuture(c)
    .pipe(
      chain((c) =>
        attemptP<string, RetrievedChronicle[]>(() =>
          createTable(db).then(() => {
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
          })
        )
      )
    )
    .pipe(map(retrievedToEntity));

/**
 * Determines if a chronicle already exists given the type and reference id.
 * @param db
 */
export const hasChronicleByReference = (db: Knex): ChronicleExistsByReference => (type) => (id) =>
  attemptP<string, Array<{ id: string }>>(() => {
    return createTable(db).then(() =>
      db
        .select(CHRONICLE_TABLE_ID)
        .from(CHRONICLE_TABLE)
        .where({
          [CHRONICLE_TABLE_REFERENCE_ID]: id,
          [CHRONICLE_TABLE_REFERENCE_TYPE]: type
        })
    );
  }).pipe(map(atLeastOne));

const getChronicleBy = (by: typeof searchFields[number]) => (db: Knex): GetChronicle => (id) =>
  attemptP<string, RetrievedChronicle[]>(() => {
    return createTable(db).then(() =>
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
    );
  }).pipe(map(retrievedToEntity));

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
