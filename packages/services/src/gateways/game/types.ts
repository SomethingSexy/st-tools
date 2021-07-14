import type { CreateGameEntity, Game } from '../../entities/game';
import type { Either } from '../../utils/sanctuary';
import type { FutureInstance } from 'fluture';

export type CreateGame = (c: Either<string, CreateGameEntity>) => FutureInstance<string, Game>;
