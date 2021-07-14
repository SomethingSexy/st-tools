import { CreateChronicleEntity, createChronicleEntity } from '../entities/chronicle.js';
import { chain, reject } from 'fluture';
import type { Gateways } from '../gateways/index.js';

export const createChronicle =
  ({ chronicleGateway }: Gateways) =>
  ({ name, referenceId, referenceType, game, version }: CreateChronicleEntity) =>
    chronicleGateway.existsByReference({ id: referenceId, type: referenceType }).pipe(
      chain((exists) => {
        if (exists) {
          return reject(`Chronicle with ${referenceId} already exists.`);
        }
        return chronicleGateway.create(createChronicleEntity({ name, referenceId, referenceType, game, version }));
      })
    );
