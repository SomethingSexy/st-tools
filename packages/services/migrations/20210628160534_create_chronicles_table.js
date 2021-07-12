export const up = (knex) =>
  knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() =>
    knex.schema.createTable('chronicle', (table) => {
      table.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));

      // Reference ID could be null if a game is created outside of an
      // app like discord
      table.string('referenceId');
      table.string('name');
      table.string('version').notNullable();
      table.string('game').notNullable();
      table.string('referenceType').notNullable();
      table.timestamps();

      table.index(['referenceId', 'referenceType', 'id']);
    })
  );

export const down = (knex) => knex.schema.dropTable('chronicle');
