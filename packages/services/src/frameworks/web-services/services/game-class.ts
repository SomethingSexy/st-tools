import type { Gateways } from '../../../gateways/index.js';
import type { RouteOptions } from 'fastify';
import { getGameClass } from '../../../use-cases/get-game-class.js';
import { handleResult } from '../utils/response.js';

const get = (gateway: Gateways): RouteOptions => ({
  method: 'GET',
  url: '/games/:gameId/classes/:id',
  handler: (request, reply) => {
    const { gameId, id } = request.params as { gameId: string; id: string };
    handleResult(reply)(getGameClass(gateway)({ gameId, id }));
  }
});

export const services = [get];
