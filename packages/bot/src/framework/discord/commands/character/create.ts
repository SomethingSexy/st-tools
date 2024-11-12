// Need to add ability to make the character public or private
// We will probably want separata commands for setting skill, attribute, discipline-power
// Basically setting one of these to 0-5, 0 would be remove.
// Need live tracking for setting, health, willpower, etc.
// Can we use subcommands to handle setting a skill, attriute,or power?
// If a character is "locked", only an admin should be able to change the character or exp would need to be spent
import { type Gateways } from '../../../../gateway/index.js'
import { type ICommand } from '../../types.js'
import { SlashCommandBuilder } from 'discord.js'
import { characterMessage } from '../../messages/character.js'
import { createCharacter } from '../../../../use-case/create-character.js'

const command: ICommand = {
  command: new SlashCommandBuilder()
    .setName('add-character')
    .setDescription('Add a Player Character or Non-Player Character')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Name of character')
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('Add user target if a Player Character.')
        .setRequired(false)
    ),
  execute(interaction, gateway: Gateways) {
    // Using a TypeGuard here but not sure it should ever get that far?>
    // Might be better to make ICommand a generic
    if (!interaction.isChatInputCommand()) {
      return
    }

    const target = interaction.options.getUser('target')

    return createCharacter(gateway)({
      name: interaction.options.getString('name'),
      referenceId: target ? target.id : null,
    }).map(characterMessage)
  },
}

export default command
