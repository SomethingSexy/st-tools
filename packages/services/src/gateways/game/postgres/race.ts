import { attemptP } from 'fluture';
import { Knex } from 'knex';
import { head } from 'lodash-es';
import { CreateRaceEntity, GameRace, UpdateRaceEntity } from '../../../entities/race.js';
import { mapAll } from '../../../utils/array.js';
import { compose } from '../../../utils/function.js';
import { pick } from '../../../utils/object.js';
import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
import { create, update } from '../../crud.js';

interface RetrievedRace {
  name: string;
  id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const GAME_RACE_TABLE = 'race';
export const GAME_RACE_TABLE_NAME = 'name';
export const GAME_RACE_TABLE_ID = TABLE_ID;
export const GAME_RACE_TABLE_DESCRIPTION = 'description';
export const GAME_RACE_TABLE_GAME_ID = 'game_id';

const retrievedColumns = [
  GAME_RACE_TABLE_ID,
  GAME_RACE_TABLE_NAME,
  GAME_RACE_TABLE_DESCRIPTION,
  CREATED_AT,
  MODIFIED_AT
];
const updateKeys = pick(['name', 'description']);

const mapRetrievedToEntity = (chronicle: RetrievedRace) => ({
  id: chronicle.id,
  name: chronicle.name,
  description: chronicle.description,
  created: chronicle.created_at,
  modified: chronicle.updated_at
});

const mapAllRetrieved = mapAll(mapRetrievedToEntity);
const retrievedToEntity: (chronicle: RetrievedRace[]) => GameRace = compose(mapRetrievedToEntity, head);

const insertAndReturnRace = (db: Knex) => (c: CreateRaceEntity) =>
  attemptP<string, RetrievedRace[]>(() => {
    const now = db.fn.now();
    return db(GAME_RACE_TABLE)
      .insert({
        [GAME_RACE_TABLE_NAME]: c.name,
        [GAME_RACE_TABLE_DESCRIPTION]: c.description,
        [GAME_RACE_TABLE_GAME_ID]: c.gameId,
        [CREATED_AT]: now,
        [MODIFIED_AT]: now
      })
      .returning(retrievedColumns);
  });

const updateAndReturnRace = (db: Knex) => (c: UpdateRaceEntity) => {
  return attemptP<string, RetrievedRace[]>(() => {
    // This needs to figure out the exact properties that we are trying to update
    // and make changes to them.  It should only update what is provided.
    const now = db.fn.now();
    return db(GAME_RACE_TABLE).where({ id: c.id }).update(updateKeys(c)).returning(retrievedColumns);
  });
};

/**
 * Updates an existing race.
 *
 * TODO: We need ways to manage the link between races and classes, should that
 * be separate functions?
 */
export const updateRace = update(updateAndReturnRace)(retrievedToEntity);

/**
 * Creates a race tied to a game
 */
export const createRace = create<CreateRaceEntity, RetrievedRace, GameRace>(insertAndReturnRace)(retrievedToEntity);
