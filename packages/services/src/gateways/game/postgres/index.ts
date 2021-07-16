import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
import type { CreateGameEntity, Game } from '../../../entities/game';
import { attemptP, chain, map } from 'fluture';
import { create, get } from '../../crud.js';
import { head, mapAll } from '../../../utils/array.js';
import { Knex } from 'knex';
import { compose } from '../../../utils/function';
import { getClasses } from './class.js';

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

export const createGame = create<CreateGameEntity, RetrievedGame, Game>(insertAndReturnGame)(retrievedToEntity);

export const getGame = (db: Knex<any, unknown[]>) => (d: { id: string }) => {
  return compose(
    chain((x: Game) => {
      return getClasses(db)({ gameId: x.id }).pipe(
        map((y) => {
          return {
            ...x,
            classes: y
          };
        })
      );
    }),
    getGameById(db)
  )(d);
};
