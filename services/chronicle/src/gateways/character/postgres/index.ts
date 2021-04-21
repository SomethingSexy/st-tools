import Knex from 'knex';

const CHARACTER_TABLE = 'character';
export const CHARACTER_TABLE_ID = 'id';

// TODO: Long term this is probably not a good idea, having to do this for every single request.
// TODO: How do we want to handle attributes that are specific to v5, jsonb, additional tables?
//   * sire/
//   * true age
//   * predator
//   * clan
//   * generation
const createTable = (db: Knex) => {
  return db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => {
    return db.schema.hasTable(CHARACTER_TABLE).then((exists) => {
      if (!exists) {
        return db.schema
          .createTable(CHARACTER_TABLE, (table) => {
            table.uuid(CHARACTER_TABLE_ID).defaultTo(db.raw('uuid_generate_v4()'));
            table.foreign('chronicle_id').references('Chronicle.chronicle_id');
            table.string('name');
            table.text('concept');
            table.text('ambition');
            table.text('desire');
            table.string('splat');
            // This will hold all splat specific data
            table.jsonb('characteristics');
            table.jsonb('attributes');
            table.jsonb('skills');
            table.jsonb('stats');
            table.timestamps();
          })
          .then(() => db);
      }
      return Promise.resolve(db);
    });
  });
};
