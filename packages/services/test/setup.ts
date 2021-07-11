import { DataType, newDb } from 'pg-mem';
import { v4 } from 'uuid';
import { up as upGame } from '../migrations/20210707003641_create_games_table';
import { up as upCharacter } from '../migrations/20210628160543_create_characters_table.js';
import { up as upChronicle } from '../migrations/20210628160534_create_chronicles_table.js';
import { up as upRace } from '../migrations/20210707201548_create_games_races_table';
// import { up as upClass } from '../migrations/20210707201536_create_games_classes_table';
// import { up as upRaceClass } from '../migrations/20210707203629_create_games_races_classes_table';

export const setupDatabase = async () => {
  const database = newDb();

  database.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: () => v4(),
      impure: true
    });
  });

  // @ts-expect-error - import knex
  const knex = (await database.adapters.createKnex(0, { debug: false })) as import('knex');

  // TODO: Figure out how to get this to work, issue with jest and swc maybe
  // await knex.migrate.latest();
  await upChronicle(knex);
  await upCharacter(knex);
  await upGame(knex);
  // // await upClass(knex);
  await upRace(knex);
  // // await upRaceClass(knex);
  // return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() =>
  // knex.schema.createTable('balls', (table) => {
  //   table.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
  //   table.index(['id']);
  // }).then(() =>   knex.schema.createTable('balls_class', (table) => {
  //   table.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
  //   table.uuid('balls_id').notNullable().references('id').inTable('balls').onDelete('CASCADE');
  //   table.index(['id']);
  // })
  
  // ).then(() => knex));

  return knex;
};
