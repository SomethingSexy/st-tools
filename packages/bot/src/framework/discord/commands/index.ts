import { type ICommand } from '../types.js'
import addCharacter from './character/create.js'
import createGame from './game/create.js'
import getGame from './game/get.js'
import listCharacters from './character/list.js'
import setCharacterProperty from './character/set-property.js'
import setGameDescription from './game/set-description.js'

export const all: ICommand[] = [
  addCharacter,
  createGame,
  getGame,
  listCharacters,
  setCharacterProperty,
  setGameDescription,
]
