// Can we use subcommands to handle setting a skill, attriute,or power?
// If a character is "locked", only an admin should be able to change the character or exp would need to be spent
import { type ICommand } from '../../types'
import { SlashCommandBuilder } from 'discord.js'
import { okAsync } from 'neverthrow'
import { v4 } from 'uuid'

const command: ICommand = {
  command: new SlashCommandBuilder()
    .setName('set-character-property')
    .setDescription('Set an attribute, skill, or power on a character')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('skill')
        .setDescription('Set the skill of a character')
        .addUserOption((option) =>
          option.setName('target').setDescription('The user')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('attribute')
        .setDescription('Set the attribute of a character')
        .addStringOption((option) =>
          option
            .setName('character')
            .setDescription('Character to apply the attribute change to')
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('power').setDescription('Set the power of a character')
    ),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(interaction, _) {
    // Using a TypeGuard here but not sure it should ever get that far?>
    // Might be better to make ICommand a generic
    if (!interaction.isChatInputCommand()) {
      return
    }

    const subcommand = interaction.options.getSubcommand()

    // if (subcommand === 'skill') {
    // } else if (subcommand === 'attribute') {
    // } else if (subcommand === 'power') {
    // }

    return okAsync(
      `Valid command ${subcommand} was passed. ${interaction.options.getString(
        'character'
      )}`
    )
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  autocomplete(interaction, _) {
    if (!interaction.isAutocomplete()) {
      return
    }
    const focusedValue = interaction.options.getFocused()
    console.log('Search value', focusedValue)
    return [
      { name: 'Foo', value: v4() },
      { name: 'Bar', value: v4() },
    ]
  },
}

export default command
