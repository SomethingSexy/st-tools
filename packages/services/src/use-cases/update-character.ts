import { chain, reject } from 'fluture';
import {
  CreateCharacterEntity,
  UpdateCharacterEntity,
  createCharacterEntity,
  updateCharacterEntity
} from '../entities/character.js';
import { Gateways } from '../gateways/index.js';

// We could expect for the caller to fetch the chronicle by id, referenceId & referenceType,
export const updateCharacter =
  ({ characterGateway }: Gateways) =>
  (data: UpdateCharacterEntity) =>
    characterGateway.getCharacterById(data.id).pipe(
      chain((character) => {
        return characterGateway.update(updateCharacterEntity(data));
      })
    );
