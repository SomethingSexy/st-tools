export const up = (knex) =>
  knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() =>
    knex.schema.createTable('game', (table) => {
      table.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));

      table.string('name');
      table.string('version').notNullable();
      table.timestamps();
    })
  );

export const down = (knex) => knex.schema.dropTable('chronicle');
