import { type Gateways } from '../../../../gateway/index.js'
import { type ICommand } from '../../types'
import { SlashCommandBuilder } from 'discord.js'
import { chronicleMessage } from '../../messages/chronicle.js'
import { createChronicle } from '../../../../use-case/create-chronicle.js'

/**
 * Handles creating a chronicle (game).  This game is tied to the discord server id.
 */
const command: ICommand = {
  command: new SlashCommandBuilder()
    .setName('create-game')
    .setDescription('Creates a new game tied to this Discord server.')
    .addStringOption((option) =>
      option.setName('name').setDescription('Name of game').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('game')
        .setDescription('Type of game')
        .setRequired(true)
        .addChoices({ name: 'Vampire the Masquerade', value: 'vtm' })
    )
    .addStringOption((option) =>
      option
        .setName('version')
        .setDescription('Version of game')
        .setRequired(true)
        .addChoices({ name: 'v5', value: 'v5' })
    ),
  execute(interaction, chronicleGateway: Gateways) {
    // Using a TypeGuard here but not sure it should ever get that far?>
    // Might be better to make ICommand a generic
    if (!interaction.isChatInputCommand()) {
      return
    }

    // TODO: Instead we could pass reference and discord guild id and the use-case can create the id from there
    return createChronicle(chronicleGateway)({
      name: interaction.options.getString('name', true),
      referenceId: interaction.guild.id,
      referenceType: 'discord',
      game: interaction.options.getString('game', true),
      version: interaction.options.getString('version', true),
      userId: interaction.user.id,
    }).map(chronicleMessage)
  },
}

export default command
