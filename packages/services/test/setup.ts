import { DataType, newDb } from 'pg-mem';
import { up as upAttribute } from '../migrations/20210718214245_create_game_attributes_table';
import { up as upAttributeCategory } from '../migrations/20210718220406_create_game_attribute_categories_table';
import { up as upCharacter } from '../migrations/20210628160543_create_characters_table.js';
import { up as upChronicle } from '../migrations/20210628160534_create_chronicles_table.js';
import { up as upClass } from '../migrations/20210707201536_create_games_classes_table';
import { up as upGame } from '../migrations/20210707003641_create_games_table';
import { up as upRace } from '../migrations/20210707201548_create_games_races_table';
import { up as upRaceClass } from '../migrations/20210707203629_create_games_races_classes_table';
import { up as upSkill } from '../migrations/20210718214340_create_game_skills_table';
import { up as upSkillCategory } from '../migrations/20210718220359_create_game_skill_categories_table';
import { v4 } from 'uuid';

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
  await upClass(knex);
  await upRace(knex);
  await upRaceClass(knex);
  await upAttributeCategory(knex);
  await upAttribute(knex);
  await upSkillCategory(knex);
  await upSkill(knex);

  return knex;
};
