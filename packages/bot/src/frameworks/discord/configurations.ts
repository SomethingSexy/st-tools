// import fs from 'fs';
import Discord from 'discord.js';
import type { ICommand } from './types';
import { all } from './commands/index.js';
// import { endsWith } from '../../utils/string.js';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const endsWithJs = endsWith('.js');
// const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(endsWithJs);
// const rawCommands = await Promise.all(commandFiles.map(async (file) => import(`${__dirname}/commands/${file}`) as Promise<ICommand>));

const discordCommands = new Discord.Collection<string, ICommand>();
all.forEach((command) => {
  discordCommands.set(command.name, command);
});

/**
 * All commands
 */
export const commandConfigurations = all;

/**
 * Returns all commands as discord collection.
 */
export const commands = discordCommands;
