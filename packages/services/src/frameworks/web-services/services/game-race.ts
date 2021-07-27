import type { Gateways } from '../../../gateways/index.js';
import type { RouteOptions } from 'fastify';
import { getGameRace } from '../../../use-cases/get-game-race.js';
import { handleResult } from '../utils/response.js';

const get = (gateway: Gateways): RouteOptions => ({
  method: 'GET',
  url: '/games/:gameId/races/:id',
  handler: (request, reply) => {
    const { gameId, id } = request.params as { gameId: string; id: string };
    handleResult(reply)(getGameRace(gateway)({ gameId, id }));
  }
});

export const services = [get];
