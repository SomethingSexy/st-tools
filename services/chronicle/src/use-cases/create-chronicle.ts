import { CreateChronicleEntity, createChronicleEntity } from '../entities/chronicle';
import { ChronicleGateway, CreateChronicle } from '../gateways/chronicle/types';

export const createChronicle = (gateway: ChronicleGateway) => ({
  name,
  referenceId,
  game,
  version
}: CreateChronicleEntity) => {
  const toCreate = createChronicleEntity({ name, referenceId, game, version });
  const createF = gateway.create(toCreate);

  return createF;
};
