import { FutureInstance } from 'fluture';
import { Character, CreateCharacterEntity } from '../../entities/character';
import { Either } from '../../utils/sanctuary';

export type CreateCharacter = (c: Either<string, CreateCharacterEntity>) => FutureInstance<string, Character>;
