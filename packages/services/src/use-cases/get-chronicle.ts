// This will need to be able to retrieve a chronicle by an external id or internal id
import { chain, reject } from 'fluture';
import type { ChronicleGateway } from '../gateways/chronicle/types';

export const getChronicle = (gateway: ChronicleGateway) => (id: string) =>
  gateway.existsById({ id }).pipe(
    chain((exists) => {
      if (!exists) {
        return reject(`Chronicle with id ${id} does not exists.`);
      }
      return gateway.getChronicleById(id);
    })
  );
