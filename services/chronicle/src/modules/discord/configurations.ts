import fs from 'fs';
import Discord from 'discord.js';
import { ICommand } from './types';
import { endsWith } from '../../utils/string';

const endsWithJs = endsWith('.js');

const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(endsWithJs);
const rawCommands = commandFiles.map((file) => require(`${__dirname}/commands/${file}`).default as ICommand);

const discordCommands = new Discord.Collection<string, ICommand>();
rawCommands.forEach((command) => {
  discordCommands.set(command.name, command);
});

/**
 * All commands
 */
export const commandConfigurations = rawCommands;

/**
 * Returns all commands as discord collection.
 */
export const commands = discordCommands;

// This does not need to change realtime
// TODO: This probably belongs in messages
export const commandsForHelp = rawCommands.map((c) => ({
  name: c.title,
  value: `!${c.name}
  ${c.description}`
}));
