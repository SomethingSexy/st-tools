import { CreateChronicleEntity, createChronicleEntity } from '../entities/chronicle';
import { ChronicleGateway, CreateChronicle } from '../gateways/chronicle/types';

export const createChronicle = (gateway: ChronicleGateway) => ({
  name,
  referenceId,
  referenceType,
  game,
  version
}: CreateChronicleEntity) => {
  gateway.existsByReference(referenceType)(referenceId);
  const toCreate = createChronicleEntity({ name, referenceId, referenceType, game, version });
  const createF = gateway.create(toCreate);

  return createF;
};
