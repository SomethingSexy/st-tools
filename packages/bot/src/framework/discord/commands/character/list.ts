import { type Gateways } from '../../../../gateway/index.js'
import { type SubCommand } from '../../types'
import { charactersMessage } from '../../messages/character.js'
import { listCharacters } from '../../../../use-case/list-characters.js'

export const listCommand: SubCommand = {
  command: (command) =>
    command.setName('list').setDescription('Retrieves a list of characters.'),
  execute(interaction, gateways: Gateways) {
    // Using a TypeGuard here but not sure it should ever get that far?>
    // Might be better to make ICommand a generic
    if (!interaction.isChatInputCommand()) {
      return
    }

    return listCharacters(gateways)().map(charactersMessage)
  },
}
