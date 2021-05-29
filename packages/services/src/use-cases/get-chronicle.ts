// This will need to be able to retrieve a chronicle by an external id or internal id
import { chain, reject } from 'fluture';
import type { Gateways } from '../gateways';

export const getChronicle = ({ chronicleGateway }: Gateways) => (id: string) =>
  chronicleGateway.existsById({ id }).pipe(
    chain((exists) => {
      if (!exists) {
        return reject(`Chronicle with id ${id} does not exists.`);
      }
      return chronicleGateway.getChronicleById(id);
    })
  );
