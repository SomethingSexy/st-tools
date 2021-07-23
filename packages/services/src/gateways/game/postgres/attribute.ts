// These are probably technically game character attributes
import { CREATED_AT, MODIFIED_AT, TABLE_DESCRIPTION, TABLE_ID, TABLE_NAME } from '../../constants.js';
import { CreateAttributeEntity, GameAttribute, UpdateAttributeEntity } from '../../../entities/attribute';
import { attemptP, map } from 'fluture';
import { create, get, update } from '../../crud.js';
import { GAME_TABLE_GAME_ID } from './constants.js';
import { Knex } from 'knex';
import { compose } from '../../../utils/function.js';
import { head } from 'lodash-es';
import { mapAll } from '../../../utils/array.js';
import { pick } from '../../../utils/object.js';

interface RetrievedAttribute {
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

const GAME_ATTRIBUTE_TABLE = 'attribute';
const GAME_ATTRIBUTE_TABLE_NAME = TABLE_NAME;
const GAME_ATTRIBUTE_TABLE_ID = TABLE_ID;
const GAME_ATTRIBUTE_TABLE_DESCRIPTION = TABLE_DESCRIPTION;
const GAME_ATTRIBUTE_TABLE_GAME_ID = GAME_TABLE_GAME_ID;
const GAME_ATTRIBUTE_TABLE_CATEGORY_ID = 'category_id';
const GAME_ATTRIBUTE_TABLE_MIN = 'min';
const GAME_ATTRIBUTE_TABLE_MAX = 'max';

const retrievedColumns = [
  GAME_ATTRIBUTE_TABLE_ID,
  GAME_ATTRIBUTE_TABLE_NAME,
  GAME_ATTRIBUTE_TABLE_DESCRIPTION,
  GAME_ATTRIBUTE_TABLE_MAX,
  GAME_ATTRIBUTE_TABLE_MIN,
  GAME_ATTRIBUTE_TABLE_GAME_ID,
  GAME_ATTRIBUTE_TABLE_CATEGORY_ID,
  CREATED_AT,
  MODIFIED_AT
];
const updateKeys = pick(['name', 'description']);

const mapRetrievedToEntity = (c: RetrievedAttribute) => ({
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
const retrievedToEntity: (chronicle: RetrievedAttribute[]) => GameAttribute = compose(mapRetrievedToEntity, head);

const insertAndReturnAttribute = (db: Knex) => (c: CreateAttributeEntity) =>
  attemptP<string, RetrievedAttribute[]>(() => {
    const now = db.fn.now();
    return db(GAME_ATTRIBUTE_TABLE)
      .insert({
        [GAME_ATTRIBUTE_TABLE_NAME]: c.name,
        [GAME_ATTRIBUTE_TABLE_DESCRIPTION]: c.description,
        [GAME_ATTRIBUTE_TABLE_MAX]: c.max,
        [GAME_ATTRIBUTE_TABLE_MIN]: c.min,
        [GAME_ATTRIBUTE_TABLE_CATEGORY_ID]: c.categoryId,
        [GAME_ATTRIBUTE_TABLE_GAME_ID]: c.gameId,
        [CREATED_AT]: now,
        [MODIFIED_AT]: now
      })
      .returning(retrievedColumns);
  });

const updateAndReturnAttribute = (db: Knex) => (c: UpdateAttributeEntity) =>
  attemptP<string, RetrievedAttribute[]>(() => {
    // This needs to figure out the exact properties that we are trying to update
    // and make changes to them.  It should only update what is provided.
    const now = db.fn.now();
    return db(GAME_ATTRIBUTE_TABLE).where({ id: c.id }).update(updateKeys(c)).returning(retrievedColumns);
  });

const getAttributeBy = (db: Knex) => (by: { [index: string]: string }) =>
  attemptP<string, RetrievedAttribute[]>(() => db.select(retrievedColumns).from(GAME_ATTRIBUTE_TABLE).where(by));

const findAllAttributes =
  (db: Knex) =>
  ({ gameId }: { gameId: string }) =>
    attemptP<string, RetrievedAttribute[]>(() =>
      db(GAME_ATTRIBUTE_TABLE)
        .where({ [GAME_ATTRIBUTE_TABLE_GAME_ID]: gameId })
        .returning(retrievedColumns)
    );

/**
 * Updates an existing attribute.
 */
export const updateAttribute = update(updateAndReturnAttribute)(retrievedToEntity);

/**
 * Creates an attribute tied to a game
 */
export const createAttribute =
  create<CreateAttributeEntity, RetrievedAttribute, GameAttribute>(insertAndReturnAttribute)(retrievedToEntity);

/**
 * Returns an attribute by id
 */
export const getAttribute = get<{ id: string }, RetrievedAttribute, GameAttribute>(getAttributeBy)(retrievedToEntity)([
  ['id', `${GAME_ATTRIBUTE_TABLE}.${GAME_ATTRIBUTE_TABLE_ID}`]
]);

/**
 * Retrieves all attributes for a given game.  This can be updated in the future to
 * support filtering, paging, and sorting.
 * @param db
 * @returns
 */
export const getAttributes = (db: Knex) => (data: { gameId: string }) =>
  findAllAttributes(db)(data).pipe(map(mapAllRetrieved));
