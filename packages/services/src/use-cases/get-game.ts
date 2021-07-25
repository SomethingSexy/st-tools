import { chain, reject } from 'fluture';
import type { Gateways } from '../gateways';

export const getGame =
  ({ gameGateway }: Gateways) =>
  ({ id }: { id?: string }) =>
    gameGateway.exists({ id }).pipe(
      chain((exists) => {
        if (!exists) {
          return reject(`Game with id ${id} does not exist.`);
        }
        return gameGateway.getGame({ id });
      })
    );
