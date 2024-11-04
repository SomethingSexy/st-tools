import {
  type GetChronicleRequest,
  buildChronicleId,
} from '../entity/chronicle.js'
import { type ChronicleGateway } from '../gateway/chronicle/types.js'

export const getChronicle =
  (gateway: ChronicleGateway) => (chronicle: GetChronicleRequest) => {
    return gateway.getChronicle(buildChronicleId(chronicle))
  }
