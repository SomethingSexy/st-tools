import { type ChronicleGateway } from '../../../../gateway/chronicle/types'
import { type ICommand } from '../../types'
import { SlashCommandBuilder } from 'discord.js'
import { chronicleMessage } from '../../messages/chronicle.js'
import { createChronicle } from '../../../../use-case/create-chronicle.js'

/**
 * Handles creating a chronicle (game).  This game is tied to the discord server id.
 */
const command: ICommand = {
  command: new SlashCommandBuilder()
    .setName('set-game-description')
    .setDescription('Sets the game description.')
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Description of game')
        .setRequired(true)
    ),
  execute(interaction, chronicleGateway: ChronicleGateway) {
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
