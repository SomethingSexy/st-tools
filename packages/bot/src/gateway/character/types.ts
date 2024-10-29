import type { Character, CreateCharacterEntity } from '../../entity/character'
import type { Either } from '../../utils/sanctuary'
import type { FutureInstance } from 'fluture'

export type CreateCharacter = (
  c: Either<string, CreateCharacterEntity>
) => FutureInstance<string, Character>
