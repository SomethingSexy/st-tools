import {
  type CreateChronicleRequest,
  chronicleEntity,
} from '../entity/chronicle.js'
import { type Gateways } from '../gateway/index.js'

export const createChronicle =
  (gateway: Gateways) =>
  ({
    name,
    referenceId,
    referenceType,
    game,
    version,
    userId,
  }: CreateChronicleRequest) => {
    // This would technically need to create a world and a game
    // We might want an endpoint that would create a "chronicle" which would be both the world
    // and the game at the same time.

    // Otherwise we would create the world first and then the game
    // if the game doesn't exist, we would need to check to see if the world
    // existed based on the server id and the create from there.

    // We might want to support id types like "uuid:", "discord:", instead of assuming it is straight up uuid
    // That could make things a bit easier when creating/fetching

    return gateway.chronicle.create(
      chronicleEntity({
        name,
        referenceId,
        referenceType,
        game,
        version,
        userId,
      })
    )
  }
