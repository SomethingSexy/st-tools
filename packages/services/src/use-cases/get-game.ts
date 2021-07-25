import { chain, reject } from 'fluture';
import type { Gateways } from '../gateways';

export const getGame =
  ({ gameGateway }: Gateways) =>
  ({ id }: { id?: string }) =>
    gameGateway.exists({ id }).pipe(
      chain((exists) => {
        if (!exists) {
          return reject(`Chronicle with id ${id} does not exists.`);
        }
        return gameGateway.getGame({ id });
      })
    );
