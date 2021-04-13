import Knex from 'knex';

const CHARACTER_TABLE = 'character';
export const CHARACTER_TABLE_ID = 'id';

// TODO: Long term this is probably not a good idea, having to do this for every single request.
const createTable = (db: Knex) => {
  return db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => {
    return db.schema.hasTable(CHARACTER_TABLE).then((exists) => {
      if (!exists) {
        return db.schema
          .createTable(CHARACTER_TABLE, (table) => {
            table.uuid(CHARACTER_TABLE_ID).defaultTo(db.raw('uuid_generate_v4()'));
            table.foreign('chronicle_id').references('Chronicle.chronicle_id');

            table.timestamps();
          })
          .then(() => db);
      }
      return Promise.resolve(db);
    });
  });
};
