import { type ChronicleGateway } from '../../../gateway/chronicle/types'
import { type ICommand } from '../types'
import { SlashCommandBuilder } from 'discord.js'
import { chronicleMessage } from '../messages/chronicle.js'
import { createChronicle } from '../../../use-case/create-chronicle.js'

/**
 * Handles creating a chronicle (game).  This game is tied to the discord server id.
 */
export default {
  command: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Creates a new game tied to this Discord server.')
    .addStringOption((option) =>
      option.setName('name').setDescription('Name of game').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('Type of game')
        .setRequired(true)
        .addChoices({ name: 'VtM - v5', value: 'vtm' })
    ),
  execute(interaction, chronicleGateway: ChronicleGateway) {
    // Using a TypeGuard here but not sure it should ever get that far?>
    // Might be better to make ICommand a generic
    if (!interaction.isChatInputCommand()) {
      return
    }
    // For each command, we will pass on the fluture but pipe here error results or success results
    // then the caller can just return the result
    return createChronicle(chronicleGateway)({
      name: interaction.options.getString('name', true),
      referenceId: interaction.guild.id,
      referenceType: 'discord',
      game: 'vtm',
      version: 'v5',
    }).map(chronicleMessage)
  },
} as ICommand
