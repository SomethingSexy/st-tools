import { resolve } from 'fluture';
import type { ICommand } from '../types';

/**
 * This will make a player if it doesn't exist and create a character for that player, make sure on subsequent calls that if they already
 * created a character from that discord id, you cannot do that again.
 */
export default {
  name: 'create-player',
  description: 'Creates a player character',
  title: 'Create Player',
  execute: () => {
    return resolve('');
  }
} as ICommand;
