export const up = (knex) =>
  knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() =>
    knex.schema.createTable('game_race_class', (table) => {
      table.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('race_id').notNullable().references('id').inTable('race').onDelete('CASCADE');
      table.uuid('class_id').notNullable().references('id').inTable('class').onDelete('CASCADE');
      table.index(['id', 'race_id', 'class_id']);
      table.timestamps();
    })
  );

export const down = (knex) => knex.schema.dropTable('game_race_class');
