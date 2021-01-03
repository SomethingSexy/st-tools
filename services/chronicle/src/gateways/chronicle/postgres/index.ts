import { attemptP, chain } from 'fluture';
import Knex from 'knex';
import { Chronicle } from '../../../entities/chronicle';
import { eitherToFuture } from '../../../utils/sanctuary';
import { CreateChronicle } from '../types';

const CHRONICLE_TABLE = 'chronicle';
export const CHRONICLE_TABLE_NAME = 'name';
export const CHRONICLE_TABLE_REFERENCE_ID = 'referenceId';
export const CHRONICLE_TABLE_ID = 'id';
export const CHRONICLE_TABLE_GAME = 'game';
export const CHRONICLE_TABLE_VERSION = 'version';

export const createChronicle = (db: Knex): CreateChronicle => (c) => {
  const f = eitherToFuture(c);

  // TODO: Break this down into multiple chains
  return f.pipe(
    chain((c) =>
      attemptP(() =>
        db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => {
          return db.schema
            .hasTable(CHRONICLE_TABLE)
            .then((exists) => {
              if (!exists) {
                return db.schema.createTable(CHRONICLE_TABLE, (table) => {
                  table.string(CHRONICLE_TABLE_REFERENCE_ID);
                  table.string(CHRONICLE_TABLE_NAME);
                  table.string(CHRONICLE_TABLE_VERSION);
                  table.string(CHRONICLE_TABLE_GAME);
                  table.uuid(CHRONICLE_TABLE_ID).defaultTo(db.raw('uuid_generate_v4()'));
                  table.index([CHRONICLE_TABLE_REFERENCE_ID, CHRONICLE_TABLE_ID]);
                  table.timestamps();
                });
              }
              return Promise.resolve();
            })
            .then(() => {
              return db(CHRONICLE_TABLE)
                .insert({
                  [CHRONICLE_TABLE_NAME]: c.name,
                  [CHRONICLE_TABLE_REFERENCE_ID]: c.referenceId,
                  [CHRONICLE_TABLE_VERSION]: c.version,
                  [CHRONICLE_TABLE_GAME]: c.game
                })
                .returning([CHRONICLE_TABLE_ID, CHRONICLE_TABLE_REFERENCE_ID, CHRONICLE_TABLE_NAME, CHRONICLE_TABLE_GAME, CHRONICLE_TABLE_VERSION])
                .then((value) => {
                  // TODO: add head function
                  return {
                    id: ((value[0] as unknown) as Chronicle).id,
                    referenceId: ((value[0] as unknown) as Chronicle).referenceId,
                    name: ((value[0] as unknown) as Chronicle).name,
                    game: ((value[0] as unknown) as Chronicle).game,
                    version: ((value[0] as unknown) as Chronicle).version,
                  };
                });
            });
        })
      )
    )
  );
};
