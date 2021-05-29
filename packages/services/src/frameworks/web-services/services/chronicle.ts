import { RouteOptions } from 'fastify';
import { createChronicle } from '../../../use-cases/create-chronicle.js';
import type { ChronicleGateway } from '../../../gateways/chronicle/types';
import type { CreateChronicleEntity } from '../../../entities/chronicle';
import { getChronicle } from '../../../use-cases/get-chronicle.js';
import { getChronicles } from '../../../use-cases/get-chronicles.js';
import { handleResult } from '../utils/response.js';
import { Gateways } from '../../../gateways/index.js';

const post = (gateway: Gateways): RouteOptions => ({
  method: 'POST',
  url: '/chronicles',
  handler: (request, reply) => {
    const body = request.body as CreateChronicleEntity;
    handleResult(reply)(createChronicle(gateway)(body));
  }
});

const get = (gateway: Gateways): RouteOptions => ({
  method: 'GET',
  url: '/chronicles/:id',
  handler: (request, reply) => {
    const { id } = request.params as { id: string };
    handleResult(reply)(getChronicle(gateway)(id));
  }
});

const getAll = (gateway: Gateways): RouteOptions => ({
  method: 'GET',
  url: '/chronicles',
  handler: (request, reply) => {
    handleResult(reply)(getChronicles(gateway)());
  }
});

export const services = [post, get, getAll];
