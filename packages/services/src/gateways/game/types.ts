import type { CreateGameEntity, Game } from '../../entities/game';
import type { Either } from '../../utils/sanctuary';
import type { FutureInstance } from 'fluture';
import { GameRace } from '../../entities/race';

export type CreateGame = (c: Either<string, CreateGameEntity>) => FutureInstance<string, Game>;

export type GetGame = (d: { id: string }) => FutureInstance<string, Game>;

export type GameExists = (d: { id?: string }) => FutureInstance<string, boolean>;

export type GetGameRace = (d: { id: string }) => FutureInstance<string, GameRace>;

export interface GameGateway {
  create: CreateGame;
  getGame: GetGame;
  exists: GameExists;
  getRace: GetGameRace;
}
