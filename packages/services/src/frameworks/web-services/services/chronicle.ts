import { RouteOptions } from 'fastify';
import { createChronicle } from '../../../use-cases/create-chronicle.js';
import type { CreateChronicleEntity } from '../../../entities/chronicle';
import { getChronicle } from '../../../use-cases/get-chronicle.js';
import { getChronicles } from '../../../use-cases/get-chronicles.js';
import { handleResult } from '../utils/response.js';
import type { Gateways } from '../../../gateways/index.js';
import type { ReferenceTypes } from '../../../entities/constants.js';
import { getCharacters } from '../../../use-cases/get-characters.js';
import { CreateCharacterEntity } from '../../../entities/character.js';
import { createCharacter } from '../../../use-cases/create-character.js';

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
    handleResult(reply)(getChronicle(gateway)({ id }));
  }
});

const getByReference = (gateway: Gateways): RouteOptions => ({
  method: 'GET',
  url: '/chronicles/:id/:type',
  handler: (request, reply) => {
    const { id, type } = request.params as { id: string; type: ReferenceTypes };
    handleResult(reply)(getChronicle(gateway)({ id, type }));
  }
});

const getAll = (gateway: Gateways): RouteOptions => ({
  method: 'GET',
  url: '/chronicles',
  handler: (request, reply) => {
    handleResult(reply)(getChronicles(gateway)());
  }
});

const getAllCharacters = (gateway: Gateways): RouteOptions => ({
  method: 'GET',
  url: '/chronicles/:id/characters',
  handler: (request, reply) => {
    const { id } = request.params as { id: string };
    handleResult(reply)(getCharacters(gateway)({ chronicleId: id }));
  }
});

// Create a character tied to a chronicle
const createChronicleCharacter = (gateway: Gateways): RouteOptions => ({
  method: 'POST',
  url: '/chronicles/:id/characters',
  handler: (request, reply) => {
    const body = request.body as CreateCharacterEntity;
    const { id } = request.params as { id: string };
    handleResult(reply)(
      createCharacter(gateway)({
        ...body,
        chronicleId: id
      })
    );
  }
});

export const services = [post, get, getAll, getByReference, getAllCharacters, createChronicleCharacter];
