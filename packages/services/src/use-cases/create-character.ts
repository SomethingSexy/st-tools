import { CreateCharacterEntity, createCharacterEntity } from '../entities/character.js';
import { chain, reject } from 'fluture';
import { Gateways } from '../gateways/index.js';

export const createCharacter =
  ({ characterGateway, chronicleGateway }: Gateways) =>
  ({ name, chronicleId, splat, referenceType }: CreateCharacterEntity) =>
    chronicleGateway.existsById({ id: chronicleId }).pipe(
      chain((exists) => {
        if (!exists) {
          return reject(`Chronicle with ${chronicleId} does not exist.`);
        }
        return characterGateway.create(createCharacterEntity({ name, chronicleId, splat, referenceType }));
      })
    );
