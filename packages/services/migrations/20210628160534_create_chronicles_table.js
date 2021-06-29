export const up = (knex) =>
  knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() =>
    knex.schema.createTable('chronicle', (table) => {
      // Reference ID could be null if a game is created outside of an
      // app like discord
      table.string('referenceId');
      table.string('name');
      table.string('version').notNullable();
      table.string('game').notNullable();
      table.string('referenceType').notNullable();
      table.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
      table.index(['referenceId', 'id']);
      table.timestamps();
    })
  );

export const down = (knex) => knex.schema.dropTable('chronicle');
