/**
 * This file will bootstrap all modules that are used in this service
 */
import { bootstrap } from './framework/discord/index.js'
import { gateways } from './gateway/index.js'
import { mock } from './service/rest/index.js'

// TODO: Swap out mock based on env variable

await bootstrap(gateways(mock))
