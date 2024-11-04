// Import all commands here, quick than trying to dynamically load commands with top level await and forcing
// the application to wait to load realtime.
import type { ICommand } from '../types.js'
import createGame from './game/create.js'
import getGame from './game/get.js'
import setGameDescription from './game/set-description.js'

export const all: ICommand[] = [createGame, setGameDescription, getGame]
