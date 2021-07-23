// This single module will handle all category operations for game related data
import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
import { CreateCategoryEntity, GameCategory } from '../../../entities/category.js';
import { GAME_TABLE_GAME_ID } from './constants.js';
import { Knex } from 'knex';
import { attemptP } from 'fluture';
import { compose } from '../../../utils/function.js';
import { create } from '../../crud.js';
import { head } from '../../../utils/array.js';

const CATEGORY_TABLE_ID = TABLE_ID;
const CATEGORY_TABLE_NAME = 'name';
const CATEGORY_TABLE_DESCRIPTION = 'description';
const ATTRIBUTE_CATEGORY_TABLE = 'attribute_category';
const SKILL_CATEGORY_TABLE = 'skill_category';

const retrievedColumns = [
  CATEGORY_TABLE_ID,
  CATEGORY_TABLE_NAME,
  CATEGORY_TABLE_DESCRIPTION,
  GAME_TABLE_GAME_ID,
  CREATED_AT,
  MODIFIED_AT
];

interface RetrievedCategory {
  name: string;
  id: string;
  description: string;
  game_id: string;
  created_at: string;
  updated_at: string;
}

const mapRetrievedToEntity = (race: RetrievedCategory): GameCategory => ({
  id: race.id,
  name: race.name,
  description: race.description,
  gameId: race.game_id,
  created: race.created_at,
  modified: race.updated_at
});

const retrievedToEntity: (race: RetrievedCategory[]) => GameCategory = compose(mapRetrievedToEntity, head);

const insertAndReturnCategory = (tableName: string) => (db: Knex) => (c: CreateCategoryEntity) =>
  attemptP<string, RetrievedCategory[]>(() => {
    const now = db.fn.now();
    return db(tableName)
      .insert({
        [CATEGORY_TABLE_NAME]: c.name,
        [CATEGORY_TABLE_DESCRIPTION]: c.description,
        [GAME_TABLE_GAME_ID]: c.gameId,
        [CREATED_AT]: now,
        [MODIFIED_AT]: now
      })
      .returning(retrievedColumns);
  });

export const createAttributeCategory = create<CreateCategoryEntity, RetrievedCategory, GameCategory>(
  insertAndReturnCategory(ATTRIBUTE_CATEGORY_TABLE)
)(retrievedToEntity);

export const createSkillCategory = create<CreateCategoryEntity, RetrievedCategory, GameCategory>(
  insertAndReturnCategory(SKILL_CATEGORY_TABLE)
)(retrievedToEntity);
