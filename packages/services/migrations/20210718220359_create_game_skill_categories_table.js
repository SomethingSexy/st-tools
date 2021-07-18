export const up = (knex) =>
  knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() =>
    knex.schema.createTable('skill_category', (table) => {
      table.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));

      table.string('name').notNullable();
      table.string('description');
      table.timestamps();
    })
  );

export const down = (knex) => knex.schema.dropTable('skill_category');
