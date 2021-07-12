import { attemptP } from 'fluture';
import { Knex } from 'knex';
import { head } from 'lodash-es';
import { CreateClassEntity, GameClass, UpdateClassEntity } from '../../../entities/class.js';
import { mapAll } from '../../../utils/array.js';
import { compose } from '../../../utils/function.js';
import { pick } from '../../../utils/object.js';
import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
import { create, update } from '../../crud.js';

interface RetrievedClass {
  name: string;
  id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const GAME_CLASS_TABLE = 'class';
export const GAME_CLASS_TABLE_NAME = 'name';
export const GAME_CLASS_TABLE_ID = TABLE_ID;
export const GAME_CLASS_TABLE_DESCRIPTION = 'description';
export const GAME_CLASS_TABLE_GAME_ID = 'game_id';

const retrievedColumns = [
  GAME_CLASS_TABLE_ID,
  GAME_CLASS_TABLE_NAME,
  GAME_CLASS_TABLE_DESCRIPTION,
  CREATED_AT,
  MODIFIED_AT
];
const updateKeys = pick(['name', 'description']);

const mapRetrievedToEntity = (c: RetrievedClass) => ({
  id: c.id,
  name: c.name,
  description: c.description,
  created: c.created_at,
  modified: c.updated_at
});

const mapAllRetrieved = mapAll(mapRetrievedToEntity);
const retrievedToEntity: (chronicle: RetrievedClass[]) => GameClass = compose(mapRetrievedToEntity, head);

const insertAndReturnClass = (db: Knex) => (c: CreateClassEntity) =>
  attemptP<string, RetrievedClass[]>(() => {
    const now = db.fn.now();
    return db(GAME_CLASS_TABLE)
      .insert({
        [GAME_CLASS_TABLE_NAME]: c.name,
        [GAME_CLASS_TABLE_DESCRIPTION]: c.description,
        [GAME_CLASS_TABLE_GAME_ID]: c.gameId,
        [CREATED_AT]: now,
        [MODIFIED_AT]: now
      })
      .returning(retrievedColumns);
  });

const updateAndReturnClass = (db: Knex) => (c: UpdateClassEntity) =>
  attemptP<string, RetrievedClass[]>(() => {
    // This needs to figure out the exact properties that we are trying to update
    // and make changes to them.  It should only update what is provided.
    const now = db.fn.now();
    return db(GAME_CLASS_TABLE).where({ id: c.id }).update(updateKeys(c)).returning(retrievedColumns);
  });

/**
 * Updates an existing class.
 */
export const updateClass = update(updateAndReturnClass)(retrievedToEntity);

/**
 * Creates a class tied to a game
 */
export const createClass =
  create<CreateClassEntity, RetrievedClass, GameClass>(insertAndReturnClass)(retrievedToEntity);
