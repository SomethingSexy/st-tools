export const up = (knex) =>
  knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() =>
    knex.schema.createTable('class', (table) => {
      table.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));

      table.uuid('game_id').notNullable().references('id').inTable('game').onDelete('CASCADE');

      table.string('name').notNullable()
      table.string('description');
      table.timestamps();
    })
  );

export const down = (knex) => knex.schema.dropTable('class');
