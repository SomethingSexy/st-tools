import { type CharacterGateway } from './character/types.js'
import { type ChronicleGateway } from './chronicle/types.js'
import { type Rest } from '../service/rest/types.js'
import { characterGateway } from './character/rest/index.js'
import { chronicleGateway } from './chronicle/rest/index.js'

export interface Gateways {
  chronicle: ChronicleGateway
  character: CharacterGateway
}

export const gateways = (options: Rest) => ({
  chronicle: chronicleGateway(options),
  character: characterGateway(options),
})
