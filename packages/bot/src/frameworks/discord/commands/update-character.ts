import { resolve } from 'fluture';
import type { ICommand } from '../types';

export default {
  name: 'update-character',
  description: 'Updates a character',
  title: 'Update Character',
  execute: () => {
    // We will need to figure out the best way for a user to update a character
    // The biggest thing to figure out is how to handle npcs, without the user
    // needing to memorize ids. 
    // 1) They could look up the character by name, so behind the scenes it would be
    // chronicle id, and name
    // 2) Or the user displays a list
    return resolve('foo');
  }
} as ICommand;
