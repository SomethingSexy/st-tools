import { type ChronicleGateway } from '../../../../gateway/chronicle/types'
import { type ICommand } from '../../types'
import { SlashCommandBuilder } from 'discord.js'
import { chronicleMessage } from '../../messages/chronicle.js'
import { getChronicle } from '../../../../use-case/get-chronicle.js'

const command: ICommand = {
  command: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Retrieves information about the active game.'),
  execute(interaction, chronicleGateway: ChronicleGateway) {
    // Using a TypeGuard here but not sure it should ever get that far?>
    // Might be better to make ICommand a generic
    if (!interaction.isChatInputCommand()) {
      return
    }

    return getChronicle(chronicleGateway)({
      referenceId: interaction.guild.id,
      referenceType: 'discord',
    }).map(chronicleMessage)
  },
}

/**
 * Handles retrieving a chronicle (game).  This game is tied to the discord server id.
 */
export default command
