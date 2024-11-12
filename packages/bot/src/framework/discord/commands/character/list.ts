import { type Gateways } from '../../../../gateway/index.js'
import { type ICommand } from '../../types'
import { SlashCommandBuilder } from 'discord.js'
import { charactersMessage } from '../../messages/character.js'
import { listCharacters } from '../../../../use-case/list-characters.js'

const command: ICommand = {
  command: new SlashCommandBuilder()
    .setName('list-characters')
    .setDescription('Retrieves a list of characters.'),
  execute(interaction, gateways: Gateways) {
    // Using a TypeGuard here but not sure it should ever get that far?>
    // Might be better to make ICommand a generic
    if (!interaction.isChatInputCommand()) {
      return
    }

    return listCharacters(gateways)().map(charactersMessage)
  },
}

export default command
