import { FastifyReply, RouteOptions } from 'fastify';
import { FutureInstance, fork } from 'fluture';
import { createChronicle } from '../../../use-cases/create-chronicle.js';
import type { ChronicleGateway } from '../../../gateways/chronicle/types';
import type { CreateChronicleEntity } from '../../../entities/chronicle';
import { getChronicle } from '../../../use-cases/get-chronicle.js';
import { getChronicles } from '../../../use-cases/get-chronicles.js';

const handleResult =
  (reply: FastifyReply) =>
  <L, R>(result: FutureInstance<L, R>) => {
    fork((e) => reply.status(400).send(e))((r) => reply.status(200).send(r))(result);
  };

const post = (gateway: ChronicleGateway): RouteOptions => ({
  method: 'POST',
  url: '/chronicles',
  handler: (request, reply) => {
    const body = request.body as CreateChronicleEntity;
    handleResult(reply)(createChronicle(gateway)(body));
  }
});

const get = (gateway: ChronicleGateway): RouteOptions => ({
  method: 'GET',
  url: '/chronicles/:id',
  handler: (request, reply) => {
    const { id } = request.params as { id: string };
    handleResult(reply)(getChronicle(gateway)(id));
  }
});

const getAll = (gateway: ChronicleGateway): RouteOptions => ({
  method: 'GET',
  url: '/chronicles',
  handler: (request, reply) => {
    handleResult(reply)(getChronicles(gateway)());
  }
});

export const services = [post, get, getAll];
