import { type ICommand } from '../../types.js'
import { SlashCommandBuilder } from 'discord.js'
import { attributeCommand } from './set-property-attribute.js'
import { createCharacterCommand } from './create.js'
import { errAsync } from 'neverthrow'
import { listCharacters } from '../../../../use-case/list-characters.js'
import { listCommand } from './list.js'
import { powerCommand } from './set-property-power.js'
import { skillCommand } from './set-property-skill.js'

const command: ICommand = {
  command: new SlashCommandBuilder()
    .setName('character')
    .setDescription('Set an attribute, skill, or power on a character')
    .addSubcommand(createCharacterCommand.command)
    .addSubcommand(listCommand.command)
    .addSubcommand(powerCommand.command)
    .addSubcommand(attributeCommand.command)
    .addSubcommand(skillCommand.command),
  execute(interaction, gateways) {
    // Using a TypeGuard here but not sure it should ever get that far?>
    // Might be better to make ICommand a generic
    if (!interaction.isChatInputCommand()) {
      return
    }

    const subcommand = interaction.options.getSubcommand()

    switch (subcommand) {
      case 'add':
        return createCharacterCommand.execute(interaction, gateways)
      case 'list':
        return listCommand.execute(interaction, gateways)
      case 'power':
        return powerCommand.execute(interaction, gateways)
      case 'skill':
        return skillCommand.execute(interaction, gateways)
      case 'attribute':
        return attributeCommand.execute(interaction, gateways)
      default:
        errAsync(
          `Invalid command ${subcommand} was passed. ${interaction.options.getString(
            'character'
          )}`
        )
    }
  },
  autocomplete(interaction, gateways) {
    if (!interaction.isAutocomplete()) {
      return
    }
    const focusedValue = interaction.options.getFocused(true)
    // TODO check if this is a character autocomplete
    console.log('Search value', focusedValue)
    return listCharacters(gateways)().map((results) =>
      results.map((result) => ({ name: result.name, value: result.id }))
    )
  },
}

export default command
