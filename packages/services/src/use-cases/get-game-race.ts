import { chain, reject } from 'fluture';
import type { Gateways } from '../gateways';

export const getGameRace =
  ({ gameGateway }: Gateways) =>
  ({ gameId, id }: { gameId: string; id?: string }) =>
    gameGateway.exists({ id: gameId }).pipe(
      chain((exists) => {
        if (!exists) {
          return reject(`Game with id ${gameId} does not exist.`);
        }
        return gameGateway.getRace({ id });
      })
    );
