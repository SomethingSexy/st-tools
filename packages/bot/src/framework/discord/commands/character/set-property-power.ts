// Can we use subcommands to handle setting a skill, attriute,or power?
// If a character is "locked", only an admin should be able to change the character or exp would need to be spent
import { type SubCommand } from '../../types'
import { okAsync } from 'neverthrow'

export const powerCommand: SubCommand = {
  command: (subcommand) =>
    subcommand.setName('power').setDescription('Set the power of a character'),
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
