import type { FutureInstance } from 'fluture';
import type { Character, CreateCharacterEntity, UpdateCharacterEntity } from '../../entities/character';
import type { Either } from '../../utils/sanctuary';

export type CreateCharacter = (c: Either<string, CreateCharacterEntity>) => FutureInstance<string, Character>;

export type UpdateCharacter = (c: Either<string, UpdateCharacterEntity>) => FutureInstance<string, Character>;

export type GetCharacter = (id: string) => FutureInstance<string, Character>;

export type GetCharacters = (d: { chronicleId: string }) => FutureInstance<string, Character[]>;

export interface CharacterGateway {
  create: CreateCharacter;
  getCharacters: GetCharacters;
  getCharacterById: GetCharacter;
  update: UpdateCharacter;
}
