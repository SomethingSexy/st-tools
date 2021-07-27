import { CreateGameEntity, createGameEntity } from '../entities/game.js';
import type { Gateways } from '../gateways/index.js';

export const createGame =
  ({ gameGateway }: Gateways) =>
  ({ name, version }: CreateGameEntity) =>
    gameGateway.create(createGameEntity({ name, version }));
