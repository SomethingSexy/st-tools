import {
  type GetChronicleRequest,
  buildChronicleId,
} from '../entity/chronicle.js'
import { type Gateways } from '../gateway/index.js'

export const getChronicle =
  (gateway: Gateways) => (chronicle: GetChronicleRequest) => {
    return gateway.chronicle.getChronicle(buildChronicleId(chronicle))
  }
