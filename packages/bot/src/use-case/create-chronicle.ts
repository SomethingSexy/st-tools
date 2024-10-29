import {
  CreateChronicleEntity,
  createChronicleEntity,
} from '../entity/chronicle.js'
import type { ChronicleGateway } from '../gateway/chronicle/types.js'

export const createChronicle =
  (gateway: ChronicleGateway) =>
  ({
    name,
    referenceId,
    referenceType,
    game,
    version,
  }: CreateChronicleEntity) => {
    return gateway.create(
      createChronicleEntity({ name, referenceId, referenceType, game, version })
    )
  }
