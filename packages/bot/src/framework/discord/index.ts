import { Client, Events, GatewayIntentBits, type Interaction } from 'discord.js'
import { type CommandResult, type Result } from './types'
import { type Gateways } from '../../gateway'
import { commands } from './configurations.js'

const sendResult = (interaction: Interaction) => (result: Result) => {
  if (interaction.isChatInputCommand()) {
    // if (isString(result)) {
    interaction.reply(result)
    // } else {
    // interaction.channel.send(result)
    // }
  }
}

const handleResult = (interaction: Interaction) => (result: CommandResult) => {
  const sendMessageResult = sendResult(interaction)
  result.map(sendMessageResult).mapErr(sendMessageResult)
}

export const bootstrap = (gateway: Gateways) => {
  // Initialize Discord Bot
  const client = new Client({ intents: [GatewayIntentBits.Guilds] })

  client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
      console.log(
        `Accepting command ${interaction.commandName} from user ${interaction.member.user.username}:${interaction.member.user.id} from server ${interaction.guild.name}:${interaction.guild.id}`
      )
      const command = commands.get(interaction.commandName)

      if (!command) {
        return
      }

      try {
        const result = command.execute(interaction, gateway)
        handleResult(interaction)(result)
      } catch (error) {
        console.error(
          `There was an error trying to issue chat input command ${interaction.commandName} - ${error}`
        )
        interaction.reply(
          `There was an error trying to execute that command! - ${error}`
        )
      }
    } else if (interaction.isAutocomplete()) {
      console.log(
        `Accepting autocomplete command ${interaction.commandName} from user ${interaction.member.user.username}:${interaction.member.user.id} from server ${interaction.guild.name}:${interaction.guild.id}`
      )
      const command = commands.get(interaction.commandName)

      if (!command || !command.autocomplete) {
        return
      }

      try {
        const result = command.autocomplete(interaction, gateway)
        await interaction.respond(result)
        // handleResult(interaction)(result)
      } catch (error) {
        console.error(
          `There was an error trying to issue autocomplete command ${interaction.commandName} - ${error}`
        )
        // TODO: Can we return an error from autocomplete?
        interaction.respond([])
      }
    }
  })

  return client.login(process.env.DISCORD_TOKEN)
}
