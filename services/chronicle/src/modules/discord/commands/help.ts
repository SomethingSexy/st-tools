import { resolve } from 'fluture';
import { commandsForHelp } from '../configurations';
import { ICommand } from '../types';

/**
 *  This command returns a list of all possible commands to the caller.
 */
export default {
  name: 'help',
  description: 'Lists all possible commands',
  title: 'Help',
  execute: () => {
    return resolve({
      embed: {
        color: 3447003,
        title: 'Commands',
        fields: commandsForHelp,
        timestamp: new Date()
      }
    });
  }
} as ICommand;
