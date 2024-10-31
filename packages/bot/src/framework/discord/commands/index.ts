// Import all commands here, quick than trying to dynamically load commands with top level await and forcing
// the application to wait to load realtime.
import type { ICommand } from '../types.js'
import createChronicle from './create-chronicle.js'

export const all: ICommand[] = [createChronicle]
