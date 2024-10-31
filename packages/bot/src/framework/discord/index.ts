import { Client, Events, GatewayIntentBits, type Interaction } from 'discord.js'
import { type CommandResult, type Result } from './types'
import { chronicleGateway } from '../../gateway/chronicle/rest/index.js'
import { commands } from './configurations.js'
import { isString } from '../../utils/string.js'
import { rest } from '../../service/rest/node.js'

const sendResult = (interaction: Interaction) => (result: Result) => {
  if (interaction.isChatInputCommand()) {
    if (isString(result)) {
      interaction.reply(result)
    } else {
      interaction.channel.send(result)
    }
  }
}

const handleResult = (interaction: Interaction) => (result: CommandResult) => {
  const sendMessageResult = sendResult(interaction)
  result.map(sendMessageResult).mapErr(sendMessageResult)
}

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

  // if (!message.content.startsWith(prefix) || message.author.bot) {
  //   return
  // }

  // const args = message.content.slice(prefix.length).trim().split(/ +/)
  // const commandName = args.shift().toLowerCase()

  // const command =
  //   commands.get(commandName) ||
  //   commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) {
    return
  }

  // if (command.guildOnly && message.channel.type === 'dm') {
  //   return message.reply("I can't execute that command inside DMs!")
  // }

  // if (command.args && !args.length) {
  //   if (command.usage) {
  //     return message.channel.send(`
  //       You didn't provide any arguments, ${message.author}!
  //       The proper usage would be: \`${prefix}${command.name} ${command.usage}
  //     `)
  //   }

  //   return message.channel.send(
  //     `You didn't provide any arguments, ${message.author}!`
  //   )
  // }

  try {
    // TODO: As we add more gateways we will want to figure out a better way to pass these in
    const result = command.execute(interaction, chronicleGateway(rest))
    handleResult(interaction)(result)
  } catch (error) {
    interaction.reply(
      `There was an error trying to execute that command! - ${error}`
    )
  }
})

client.login(process.env.DISCORD_TOKEN)
