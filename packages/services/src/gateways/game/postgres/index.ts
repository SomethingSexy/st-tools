import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
import type { CreateGameEntity, Game } from '../../../entities/game';
import { head, mapAll } from '../../../utils/array.js';
import { Knex } from 'knex';
import { attemptP } from 'fluture';
import { compose } from '../../../utils/function';
import { create } from '../../crud.js';

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

const mapRetrievedToEntity = (chronicle: RetrievedGame) => ({
  id: chronicle.id,
  name: chronicle.name,
  version: chronicle.version,
  created: chronicle.created_at,
  modified: chronicle.updated_at
});

const mapAllRetrieved = mapAll(mapRetrievedToEntity);
const retrievedToEntity: (chronicle: RetrievedGame[]) => Game = compose(mapRetrievedToEntity, head);

const insertAndReturnChronicle = (db: Knex) => (c: CreateGameEntity) =>
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

export const createGame = create<CreateGameEntity, RetrievedGame, Game>(insertAndReturnChronicle)(retrievedToEntity);
