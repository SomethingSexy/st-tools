import type { CharacterGateway } from './character/types.js';
import type { ChronicleGateway } from './chronicle/types.js';
import { Knex } from 'knex';
import { characterGateway } from './character/postgres/index.js';
import { chronicleGateway } from './chronicle/postgres/index.js';

export interface Gateways {
  chronicleGateway: ChronicleGateway;
  characterGateway: CharacterGateway;
}

export const gateways = (db: Knex): Gateways => ({
  chronicleGateway: chronicleGateway(db),
  characterGateway: characterGateway(db)
});
