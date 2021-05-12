import { resolve } from 'fluture';
import type { ICommand } from '../types';
import { commandConfigurations } from '../configurations.js';

/**
 *  This command returns a list of all possible commands to the caller.
 */
export default {
  name: 'help',
  description: 'Lists all possible commands',
  title: 'Help',
  execute: () => {
    // This does not need to change realtime
    // TODO: This probably belongs in messages
    const commandsForHelp = commandConfigurations.map((c) => ({
      name: c.title,
      value: `!${c.name}
  ${c.description}`
    }));

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
