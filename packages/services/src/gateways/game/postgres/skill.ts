// These are probably technically game character attributes
import { CREATED_AT, MODIFIED_AT, TABLE_DESCRIPTION, TABLE_ID, TABLE_NAME } from '../../constants.js';
import { CreateSkillEntity, GameSkill, UpdateSkillEntity } from '../../../entities/skill';
import { attemptP, map } from 'fluture';
import { create, get, update } from '../../crud.js';
import { GAME_TABLE_GAME_ID } from './constants.js';
import { Knex } from 'knex';
import { compose } from '../../../utils/function.js';
import { head } from 'lodash-es';
import { mapAll } from '../../../utils/array.js';
import { pick } from '../../../utils/object.js';

interface RetrievedSkill {
  name: string;
  id: string;
  description: string;
  max: number;
  min: number;
  category_id: string;
  game_id: string;
  created_at: string;
  updated_at: string;
}

const GAME_SKILL_TABLE = 'skill';
const GAME_SKILL_TABLE_NAME = TABLE_NAME;
const GAME_SKILL_TABLE_ID = TABLE_ID;
const GAME_SKILL_TABLE_DESCRIPTION = TABLE_DESCRIPTION;
const GAME_SKILL_TABLE_GAME_ID = GAME_TABLE_GAME_ID;
const GAME_SKILL_TABLE_CATEGORY_ID = 'category_id';
const GAME_SKILL_TABLE_MIN = 'min';
const GAME_SKILL_TABLE_MAX = 'max';

const retrievedColumns = [
  GAME_SKILL_TABLE_ID,
  GAME_SKILL_TABLE_NAME,
  GAME_SKILL_TABLE_DESCRIPTION,
  GAME_SKILL_TABLE_MAX,
  GAME_SKILL_TABLE_MIN,
  GAME_SKILL_TABLE_GAME_ID,
  GAME_SKILL_TABLE_CATEGORY_ID,
  CREATED_AT,
  MODIFIED_AT
];
const updateKeys = pick(['name', 'description']);

const mapRetrievedToEntity = (c: RetrievedSkill) => ({
  id: c.id,
  name: c.name,
  description: c.description,
  max: c.max,
  min: c.min,
  categoryId: c.category_id,
  gameId: c.game_id,
  created: c.created_at,
  modified: c.updated_at
});

const mapAllRetrieved = mapAll(mapRetrievedToEntity);
const retrievedToEntity: (chronicle: RetrievedSkill[]) => GameSkill = compose(mapRetrievedToEntity, head);

const insertAndReturnSkill = (db: Knex) => (c: CreateSkillEntity) =>
  attemptP<string, RetrievedSkill[]>(() => {
    const now = db.fn.now();
    return db(GAME_SKILL_TABLE)
      .insert({
        [GAME_SKILL_TABLE_NAME]: c.name,
        [GAME_SKILL_TABLE_DESCRIPTION]: c.description,
        [GAME_SKILL_TABLE_MAX]: c.max,
        [GAME_SKILL_TABLE_MIN]: c.min,
        [GAME_SKILL_TABLE_CATEGORY_ID]: c.categoryId,
        [GAME_SKILL_TABLE_GAME_ID]: c.gameId,
        [CREATED_AT]: now,
        [MODIFIED_AT]: now
      })
      .returning(retrievedColumns);
  });

const updateAndReturnSkill = (db: Knex) => (c: UpdateSkillEntity) =>
  attemptP<string, RetrievedSkill[]>(() => {
    // This needs to figure out the exact properties that we are trying to update
    // and make changes to them.  It should only update what is provided.
    const now = db.fn.now();
    return db(GAME_SKILL_TABLE).where({ id: c.id }).update(updateKeys(c)).returning(retrievedColumns);
  });

const getSkillBy = (db: Knex) => (by: { [index: string]: string }) =>
  attemptP<string, RetrievedSkill[]>(() => db.select(retrievedColumns).from(GAME_SKILL_TABLE).where(by));

const findAllSkills =
  (db: Knex) =>
  ({ gameId }: { gameId: string }) =>
    attemptP<string, RetrievedSkill[]>(() =>
      db(GAME_SKILL_TABLE)
        .where({ [GAME_SKILL_TABLE_GAME_ID]: gameId })
        .returning(retrievedColumns)
    );

/**
 * Updates an existing skill.
 */
export const updateSkill = update(updateAndReturnSkill)(retrievedToEntity);

/**
 * Creates an skill tied to a game
 */
export const createSkill =
  create<CreateSkillEntity, RetrievedSkill, GameSkill>(insertAndReturnSkill)(retrievedToEntity);

/**
 * Returns a skill by id
 */
export const getSkill = get<{ id: string }, RetrievedSkill, GameSkill>(getSkillBy)(retrievedToEntity)([
  ['id', `${GAME_SKILL_TABLE}.${GAME_SKILL_TABLE_ID}`]
]);

/**
 * Retrieves all skills for a given game.  This can be updated in the future to
 * support filtering, paging, and sorting.
 * @param db
 * @returns
 */
export const getSkills = (db: Knex) => (data: { gameId: string }) => findAllSkills(db)(data).pipe(map(mapAllRetrieved));
