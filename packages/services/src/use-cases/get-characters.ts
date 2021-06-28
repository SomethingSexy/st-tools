// This will need to be able to retrieve a chronicle by an external id or internal id
import { chain, reject } from 'fluture';
import type { Gateways } from '../gateways';

export const getCharacters =
  ({ chronicleGateway, characterGateway }: Gateways) =>
  ({ chronicleId }: { chronicleId: string }) =>
    chronicleGateway.exists({ id: chronicleId }).pipe(
      chain((exists) => {
        if (!exists) {
          return reject(`Chronicle with id ${chronicleId} does not exists.`);
        }
        return characterGateway.getCharacters({ chronicleId });
      })
    );
