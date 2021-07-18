import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
import { CreateRaceEntity, GameRace, UpdateRaceEntity } from '../../../entities/race.js';
import { FutureInstance, attemptP, map } from 'fluture';
import { GAME_RACE_CLASS_TABLE, GAME_RACE_CLASS_TABLE_CLASS_ID, GAME_RACE_CLASS_TABLE_RACE_ID } from './constants.js';
import { create, get, update } from '../../crud.js';
import { Knex } from 'knex';
import { compose } from '../../../utils/function.js';
import { head } from 'lodash-es';
import { pick } from '../../../utils/object.js';

interface RetrievedRace {
  name: string;
  id: string;
  description: string;
  game_id: string;
  /**
   * This gets added when doing a leftJoin to get all available
   * classes
   */
  class_id: string;
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
  `${GAME_RACE_TABLE}.${GAME_RACE_TABLE_ID}`,
  `${GAME_RACE_TABLE}.${GAME_RACE_TABLE_NAME}`,
  `${GAME_RACE_TABLE}.${GAME_RACE_TABLE_DESCRIPTION}`,
  `${GAME_RACE_TABLE}.${GAME_RACE_TABLE_GAME_ID}`,
  `${GAME_RACE_TABLE}.${CREATED_AT}`,
  `${GAME_RACE_TABLE}.${MODIFIED_AT}`
];

const retrievedColumnsWithChildData = [...retrievedColumns, `${GAME_RACE_CLASS_TABLE_CLASS_ID} AS class_id`];

const updateKeys = pick(['name', 'description']);

const mapRetrievedToEntity = (race: RetrievedRace): GameRace => ({
  id: race.id,
  name: race.name,
  description: race.description,
  classes: [],
  gameId: race.game_id,
  created: race.created_at,
  modified: race.updated_at
});

const mapRetrievedLinkToEntity = (link: { id: string; class_id: string; race_id: string }) => ({
  id: link.id,
  classId: link.class_id,
  raceId: link.race_id
});

const mapAllRetrieved: (x: RetrievedRace[]) => GameRace[] = (races) => {
  // Using imperative form here because the search through the results should
  // be faster than using reduce, and constantly merging
  // OK with mutating when it is within this function only
  const normalizedRaces: GameRace[] = [];
  let racePointer = 0;
  // using while because we are going to jump pointers after we find related data
  while (racePointer < races.length) {
    const race = races[racePointer];
    // do we have sub data?
    if (race.id === races[racePointer + 1]?.id) {
      let classIdPointer = racePointer + 1;
      const classIds = [];
      // Could go all the way to the end if it is the last race
      while (classIdPointer < races.length && race.id === races[classIdPointer].id) {
        classIds.push(races[classIdPointer].class_id);
        classIdPointer++;
      }
      normalizedRaces.push({
        ...mapRetrievedToEntity(race),
        classes: classIds
      });
      // jump forward
      racePointer = classIdPointer;
    } else {
      normalizedRaces.push(mapRetrievedToEntity(race));
      // At this point we can just continue to the next
      racePointer++;
    }
  }

  return normalizedRaces;
};

const retrievedToEntity: (race: RetrievedRace[]) => GameRace = compose(mapRetrievedToEntity, head);

const pickClassId = (data: RetrievedRace) => data.class_id;

// This will be the new one going forward, in this case if we joined data we will have an array
// of returned data that we need to merge,
const retrievedChildDataToEntity = (race: RetrievedRace[]) => {
  // At this point we should always be guaranteed 1
  const root = retrievedToEntity(race);
  const classes = race.map(pickClassId);

  return {
    ...root,
    classes
  };
};

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

const getRaceBy = (db: Knex) => (by: { [index: string]: string }) =>
  attemptP<string, RetrievedRace[]>(() =>
    db
      .select(retrievedColumnsWithChildData)
      .from(GAME_RACE_TABLE)
      .where(by)
      .leftJoin(GAME_RACE_CLASS_TABLE, `${GAME_RACE_TABLE}.${GAME_RACE_TABLE_ID}`, GAME_RACE_CLASS_TABLE_RACE_ID)
  );

const findAllRaces =
  (db: Knex) =>
  ({ gameId }: { gameId: string }) =>
    attemptP<string, RetrievedRace[]>(() =>
      db(GAME_RACE_TABLE)
        .where({ [GAME_RACE_TABLE_GAME_ID]: gameId })
        .leftJoin(GAME_RACE_CLASS_TABLE, `${GAME_RACE_TABLE}.${GAME_RACE_TABLE_ID}`, GAME_RACE_CLASS_TABLE_RACE_ID)
        .returning(retrievedColumnsWithChildData)
    );

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

export const getRace = get<{ id: string }, RetrievedRace, GameRace>(getRaceBy)(retrievedChildDataToEntity)([
  ['id', `${GAME_RACE_TABLE}.${GAME_RACE_TABLE_ID}`]
]);

/**
 * Retrieves all races for a given game.  This can be updated in the future to
 * support filtering, paging, and sorting.
 * @param db
 * @returns
 */
export const getRaces =
  (db: Knex) =>
  (data: { gameId: string }): FutureInstance<string, GameRace[]> =>
    findAllRaces(db)(data).pipe(map(mapAllRetrieved));

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
      return db(GAME_RACE_CLASS_TABLE)
        .insert({
          class_id: classId,
          race_id: raceId,
          [CREATED_AT]: now,
          [MODIFIED_AT]: now
        })
        .returning([GAME_RACE_CLASS_TABLE_ID, GAME_RACE_CLASS_TABLE_CLASS_ID, GAME_RACE_CLASS_TABLE_RACE_ID]);
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
      db(GAME_RACE_CLASS_TABLE)
        .where({
          [GAME_RACE_CLASS_TABLE_CLASS_ID]: classId,
          [GAME_RACE_CLASS_TABLE_RACE_ID]: raceId
        })
        .del()
    ).pipe(map(() => ({ classId, raceId })));
