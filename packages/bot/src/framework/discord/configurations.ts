import { Collection } from 'discord.js'
import { type ICommand } from './types'
import { all } from './commands/index.js'

const discordCommands = new Collection<string, ICommand>()

all.forEach((command) => {
  discordCommands.set(command.command.name, command)
})

/**
 * All commands
 */
export const commandConfigurations = all

/**
 * Returns all commands as discord collection.
 */
export const commands = discordCommands
