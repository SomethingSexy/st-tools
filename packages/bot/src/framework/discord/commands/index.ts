import { type ICommand } from '../types.js'
import characterCommands from './character/command.js'
import createGame from './game/create.js'
import getGame from './game/get.js'
import setGameDescription from './game/set-description.js'

export const all: ICommand[] = [
  characterCommands,
  createGame,
  getGame,
  setGameDescription,
]
