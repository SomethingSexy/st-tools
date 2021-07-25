import type { CreateGameEntity, Game } from '../../entities/game';
import type { Either } from '../../utils/sanctuary';
import type { FutureInstance } from 'fluture';

export type CreateGame = (c: Either<string, CreateGameEntity>) => FutureInstance<string, Game>;

export type GetGame = (d: { id: string }) => FutureInstance<string, Game>;

export type GameExists = (d: { id?: string }) => FutureInstance<string, boolean>;

export interface GameGateway {
  create: CreateGame;
  getGame: GetGame;
  exists: GameExists;
}
