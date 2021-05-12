import type { FutureInstance } from 'fluture';
import type { Character, CreateCharacterEntity } from '../../entities/character';
import type { Either } from '../../utils/sanctuary';

export type CreateCharacter = (c: Either<string, CreateCharacterEntity>) => FutureInstance<string, Character>;
