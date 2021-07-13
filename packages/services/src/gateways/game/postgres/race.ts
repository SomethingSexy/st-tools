import { attemptP, map } from 'fluture';
import { Knex } from 'knex';
import { head } from 'lodash-es';
import { CreateRaceEntity, GameRace, UpdateRaceEntity } from '../../../entities/race.js';
import { mapAll } from '../../../utils/array.js';
import { compose } from '../../../utils/function.js';
import { pick } from '../../../utils/object.js';
import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
import { create, get, update } from '../../crud.js';
import { GAME_CLASS_TABLE_ID } from './class.js';

interface RetrievedRace {
  name: string;
  id: string;
  description: string;
  game_id: string;
  created_at: string;
  updated_at: string;
}

export const GAME_RACE_TABLE = 'race';
export const GAME_RACE_TABLE_NAME = 'name';
export const GAME_RACE_TABLE_ID = TABLE_ID;
export const GAME_RACE_TABLE_DESCRIPTION = 'description';
export const GAME_RACE_TABLE_GAME_ID = 'game_id';

export const GAME_RACE_CLASS_TABLE_ID = TABLE_ID;

const retrievedColumns = [
  GAME_RACE_TABLE_ID,
  GAME_RACE_TABLE_NAME,
  GAME_RACE_TABLE_DESCRIPTION,
  GAME_RACE_TABLE_GAME_ID,
  CREATED_AT,
  MODIFIED_AT
];
const updateKeys = pick(['name', 'description']);

const mapRetrievedToEntity = (race: RetrievedRace) => ({
  id: race.id,
  name: race.name,
  description: race.description,
  gameId: race.game_id,
  created: race.created_at,
  modified: race.updated_at
});

const mapRetrievedLinkToEntity = (link: { id: string; class_id: string; race_id: string }) => ({
  id: link.id,
  classId: link.class_id,
  raceId: link.race_id
});

const mapAllRetrieved = mapAll(mapRetrievedToEntity);
const retrievedToEntity: (chronicle: RetrievedRace[]) => GameRace = compose(mapRetrievedToEntity, head);

const retrievedLinkToEntity: (link: Array<{ id: string; class_id: string; race_id: string }>) => {
  id: string;
  classId: string;
  raceId: string;
} = compose(mapRetrievedLinkToEntity, head);

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

const updateAndReturnRace = (db: Knex) => (c: UpdateRaceEntity) =>
  attemptP<string, RetrievedRace[]>(() => {
    // This needs to figure out the exact properties that we are trying to update
    // and make changes to them.  It should only update what is provided.
    const now = db.fn.now();
    return db(GAME_RACE_TABLE).where({ id: c.id }).update(updateKeys(c)).returning(retrievedColumns);
  });

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

const getRaceBy = (db: Knex) => (by: { [index: string]: string }) =>
  attemptP<string, RetrievedRace[]>(() => db.select(retrievedColumns).from(GAME_RACE_TABLE).where(by));

export const getRace = get<{ id: string }, RetrievedRace, GameRace>(getRaceBy)(retrievedToEntity)([
  ['id', GAME_RACE_TABLE_ID]
]);

/**
 * Links a class to a race
 * @param db
 * @returns
 */
export const linkClassToRace =
  (db: Knex) =>
  ({ raceId, classId }: { raceId: string; classId: string }) =>
    attemptP<string, Array<{ id: string; class_id: string; race_id: string }>>(() => {
      const now = db.fn.now();
      return db('game_race_class')
        .insert({
          class_id: classId,
          race_id: raceId,
          [CREATED_AT]: now,
          [MODIFIED_AT]: now
        })
        .returning([GAME_RACE_CLASS_TABLE_ID, 'class_id', 'race_id']);
    }).pipe(map(retrievedLinkToEntity));

/**
 * Deletes a link from a class
 * @param db
 * @returns
 */
export const unlinkClassFromRace =
  (db: Knex) =>
  ({ raceId, classId }: { raceId: string; classId: string }) =>
    attemptP<string, RetrievedRace[]>(() =>
      db('game_race_class')
        .where({
          class_id: classId,
          race_id: raceId
        })
        .del()
    ).pipe(map(() => ({ classId, raceId })));
