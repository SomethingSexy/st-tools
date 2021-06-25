// This will need to be able to retrieve a chronicle by an external id or internal id
import { chain, reject } from 'fluture';
import { ReferenceTypes } from '../entities/constants';
import type { Gateways } from '../gateways';

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
