export const up = (knex) =>
  knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() =>
    knex.schema.createTable('character', (table) => {
      table.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));

      table.uuid('chronicle_id').notNullable().references('id').inTable('chronicle').onDelete('CASCADE');

      // Reference ID can be null, the only time we will have an id is for player
      // characters created via apps like discord
      table.string('referenceId');
      // Reference Type should never be null
      table.string('referenceType').notNullable();
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

      table.index(['referenceId', 'referenceType', 'id']);
    })
  );

export const down = (knex) => knex.schema.dropTable('character');
