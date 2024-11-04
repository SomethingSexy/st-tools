import { Client, Events, GatewayIntentBits, type Interaction } from 'discord.js'
import { type CommandResult, type Result } from './types'
import { type ChronicleGateway } from '../../gateway/chronicle/types'
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

// TODO: As we add more gateways we will want to figure out a better way to pass these in
export const bootstrap = (gateway: ChronicleGateway) => {
  // Initialize Discord Bot
  const client = new Client({ intents: [GatewayIntentBits.Guilds] })

  client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })

  client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand()) {
      return
    }

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
      interaction.reply(
        `There was an error trying to execute that command! - ${error}`
      )
    }
  })

  return client.login(process.env.DISCORD_TOKEN)
}
