import type { FutureInstance } from 'fluture';
import type { CreateGameEntity, Game } from '../../entities/game';
import type { Either } from '../../utils/sanctuary';

export type CreateGame = (c: Either<string, CreateGameEntity>) => FutureInstance<string, Game>;
