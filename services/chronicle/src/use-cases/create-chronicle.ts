import { chain, FutureInstance, reject } from 'fluture';
import { Chronicle, CreateChronicleEntity, createChronicleEntity } from '../entities/chronicle';
import { ChronicleGateway } from '../gateways/chronicle/types';

export const createChronicle = (gateway: ChronicleGateway) => ({
  name,
  referenceId,
  referenceType,
  game,
  version
}: CreateChronicleEntity) => {
  return gateway
    .existsByReference(referenceType)(referenceId)
    .pipe(
      chain((exists) => {
        if (exists) {
          return reject(`Chronicle with ${referenceId} already exists.`);
        }
        return gateway.create(createChronicleEntity({ name, referenceId, referenceType, game, version }));
      })
    );
};
