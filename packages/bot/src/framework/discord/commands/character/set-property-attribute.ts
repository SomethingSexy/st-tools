// Can we use subcommands to handle setting a skill, attriute,or power?
// If a character is "locked", only an admin should be able to change the character or exp would need to be spent
import { SubCommand } from '../../types'
import { okAsync } from 'neverthrow'

export const attributeCommand: SubCommand = {
  command: (command) =>
    command
      .setName('attribute')
      .setDescription('Set the attribute of a character')
      .addStringOption((option) =>
        option
          .setName('character')
          .setDescription('Character to apply the attribute change to')
          .setAutocomplete(true)
      ),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(interaction, _) {
    // Using a TypeGuard here but not sure it should ever get that far?>
    // Might be better to make ICommand a generic
    if (!interaction.isChatInputCommand()) {
      return
    }

    const subcommand = interaction.options.getSubcommand()

    return okAsync(
      `Valid command ${subcommand} was passed. ${interaction.options.getString(
        'character'
      )}`
    )
  },
}
