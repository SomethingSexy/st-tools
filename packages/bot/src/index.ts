/**
 * This file will bootstrap all modules that are used in this service
 */
import { bootstrap } from './framework/discord/index.js'
import { chronicleGateway } from './gateway/chronicle/rest/index.js'
import { mock } from './service/rest/index.js'

await bootstrap(chronicleGateway(mock))
