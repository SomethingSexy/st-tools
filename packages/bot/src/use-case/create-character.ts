import { type Gateways } from '../gateway/index.js'
import { characterEntity } from '../entity/character.js'

export const createCharacter =
  ({ character }: Gateways) =>
  ({ name, referenceId }: { name: string; referenceId: string | null }) => {
    // Id could be uuid:<uuid> or discord:<userId>
    // This would support player characters

    // We might want to support id types like "uuid:", "discord:", instead of assuming it is straight up uuid
    // That could make things a bit easier when creating/fetching

    return character.create(
      characterEntity({
        name,
        referenceId,
        referenceType: 'discord',
      })
    )
  }
