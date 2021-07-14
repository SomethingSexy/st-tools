// This will need to be able to retrieve a chronicle by an external id or internal id
import { chain, reject } from 'fluture';
import type { Gateways } from '../gateways';
import type { ReferenceTypes } from '../entities/constants';

export const getChronicle =
  ({ chronicleGateway }: Gateways) =>
  ({ id, type }: { id?: string; type?: ReferenceTypes }) =>
    chronicleGateway.exists({ id, type }).pipe(
      chain((exists) => {
        if (!exists) {
          return reject(`Chronicle with id ${id} does not exists.`);
        }
        return chronicleGateway.getChronicle({ id, type });
      })
    );
