// Import all commands here, quick than trying to dynamically load commands with top level await and forcing
// the application to wait to load realtime.
import type { ICommand } from '../types.js'
import createCharacter from './create-character.js'
import createChronicle from './create-chronicle.js'
import createPlayerCharacter from './create-player-character.js'
import help from './help.js'
import roll from './roll.js'

export const all: ICommand[] = [
  createCharacter,
  createChronicle,
  createPlayerCharacter,
  help,
  roll,
]
