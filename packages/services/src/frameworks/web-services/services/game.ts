import { CreateGameEntity } from '../../../entities/game.js';
import type { Gateways } from '../../../gateways/index.js';
import { RouteOptions } from 'fastify';
import { createGame } from '../../../use-cases/create-game.js';
import { getGame } from '../../../use-cases/get-game.js';
import { handleResult } from '../utils/response.js';

const post = (gateway: Gateways): RouteOptions => ({
  method: 'POST',
  url: '/games',
  handler: (request, reply) => {
    const body = request.body as CreateGameEntity;
    handleResult(reply)(createGame(gateway)(body));
  }
});

const get = (gateway: Gateways): RouteOptions => ({
  method: 'GET',
  url: '/games/:id',
  handler: (request, reply) => {
    const { id } = request.params as { id: string };
    handleResult(reply)(getGame(gateway)({ id }));
  }
});

export const services = [post, get];
