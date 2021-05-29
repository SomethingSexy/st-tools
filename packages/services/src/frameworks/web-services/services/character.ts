import { RouteOptions } from 'fastify';
import { CreateCharacterEntity } from '../../../entities/character';
import { Gateways } from '../../../gateways';
import { createCharacter } from '../../../use-cases/create-character';
import { handleResult } from '../utils/response';

export const post = (gateway: Gateways): RouteOptions => ({
  method: 'POST',
  url: 'characters',
  handler: (request, reply) => {
    const body = request.body as CreateCharacterEntity;
    handleResult(reply)(createCharacter(gateway)(body));
  }
});

export const services = [post];
