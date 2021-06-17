import { RouteOptions } from 'fastify';
import { CreateCharacterEntity } from '../../../entities/character';
import { Gateways } from '../../../gateways';
import { createCharacter } from '../../../use-cases/create-character';
import { handleResult } from '../utils/response';

/**
 * Creates a new character
 * @param gateway
 * @returns
 */
export const post = (gateway: Gateways): RouteOptions => ({
  method: 'POST',
  url: 'characters',
  handler: (request, reply) => {
    const body = request.body as CreateCharacterEntity;
    handleResult(reply)(createCharacter(gateway)(body));
  }
});

/**
 * Updates pieces of a character.  Excluded pieces will not be removed unless
 * they are set to null.
 *
 * @param gateway
 * @returns
 */
export const patch = (gateway: Gateways): RouteOptions => ({
  method: 'PATCH',
  url: 'characters/:id',
  handler: (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body;
  }
});

export const services = [post];
