import { chain, reject } from 'fluture';
import { CreateChronicleEntity, createChronicleEntity } from '../entities/chronicle.js';
import type { ChronicleGateway } from '../gateways/chronicle/types';

export const createChronicle = (gateway: ChronicleGateway) => ({
  name,
  referenceId,
  referenceType,
  game,
  version
}: CreateChronicleEntity) => {
  return gateway.create(createChronicleEntity({ name, referenceId, referenceType, game, version }));
};
