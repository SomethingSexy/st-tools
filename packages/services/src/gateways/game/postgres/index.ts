import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
import type { CreateGameEntity, Game } from '../../../entities/game';
import { FutureInstance, attemptP, chain, map } from 'fluture';
import { create, get } from '../../crud.js';
import { head, mapAll } from '../../../utils/array.js';
import type { GameClass } from '../../../entities/class.js';
import type { GameRace } from '../../../entities/race.js';
import { Knex } from 'knex';
import { compose } from '../../../utils/function';
import { getClasses } from './class.js';
import { getRaces } from './race.js';

interface RetrievedGame {
  name: string;
  id: string;
  version: string;
  created_at: string;
  updated_at: string;
}

export const GAME_TABLE = 'game';
export const GAME_TABLE_NAME = 'name';
export const GAME_TABLE_ID = TABLE_ID;
export const GAME_TABLE_VERSION = 'version';

const retrievedColumns = [GAME_TABLE_ID, GAME_TABLE_NAME, GAME_TABLE_VERSION, CREATED_AT, MODIFIED_AT];

const mapRetrievedToEntity = (chronicle: RetrievedGame) => ({
  id: chronicle.id,
  name: chronicle.name,
  version: chronicle.version,
  created: chronicle.created_at,
  modified: chronicle.updated_at
});

const mapAllRetrieved = mapAll(mapRetrievedToEntity);
const retrievedToEntity: (chronicle: RetrievedGame[]) => Game = compose(mapRetrievedToEntity, head);

const insertAndReturnGame = (db: Knex) => (c: CreateGameEntity) =>
  attemptP<string, RetrievedGame[]>(() => {
    const now = db.fn.now();
    return db(GAME_TABLE)
      .insert({
        [GAME_TABLE_NAME]: c.name,
        [GAME_TABLE_VERSION]: c.version,
        [CREATED_AT]: now,
        [MODIFIED_AT]: now
      })
      .returning([GAME_TABLE_ID, GAME_TABLE_NAME, GAME_TABLE_VERSION, CREATED_AT, MODIFIED_AT]);
  });

const getGameBy = (db: Knex) => (by: { [index: string]: string }) =>
  attemptP<string, RetrievedGame[]>(() => db.select(retrievedColumns).from(GAME_TABLE).where(by));

const getGameById = get<{ id: string }, RetrievedGame, Game>(getGameBy)(retrievedToEntity)([
  ['id', `${GAME_TABLE}.${GAME_TABLE_ID}`]
]);

const mergeClasses = (g: Game) => (c: GameClass[]) => {
  return {
    ...g,
    classes: c
  };
};

const getAndMergeClasses = (db: Knex) => (g: Game) => getClasses(db)({ gameId: g.id }).pipe(map(mergeClasses(g)));

const mergeRaces = (g: Game) => (r: GameRace[]) => {
  return {
    ...g,
    races: r
  };
};

const getAndMergeRaces = (db: Knex) => (g: Game) => getRaces(db)({ gameId: g.id }).pipe(map(mergeRaces(g)));

/**
 * Creates a new game type.
 */
export const createGame = create<CreateGameEntity, RetrievedGame, Game>(insertAndReturnGame)(retrievedToEntity);

/**
 * Returns a game by id and all associated data.
 * @param db
 * @returns
 */
export const getGame = (db: Knex<any, unknown[]>): ((d: { id: string }) => FutureInstance<string, Game>) =>
  compose(chain(getAndMergeRaces(db)), chain(getAndMergeClasses(db)), getGameById(db));
