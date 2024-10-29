import type { CommandResult, Result } from './types'
import Discord from 'discord.js'
import { chronicleGateway } from '../../gateway/chronicle/rest/index.js'
import { commands } from './configurations.js'
import { fork } from 'fluture'
import { isString } from '../../utils/string.js'
import { rest } from '../../service/rest/node.js'

const prefix = '!'

const sendResult = (message: Discord.Message) => (result: Result) => {
  if (isString(result)) {
    message.reply(result)
  } else {
    message.channel.send(result)
  }
}

const handleResult = (message: Discord.Message) => (result: CommandResult) => {
  const sendMessageResult = sendResult(message)
  fork(sendMessageResult)(sendMessageResult)(result)
}

// Initialize Discord Bot
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', (message) => {
  console.log(
    `Accepting command ${message.content} from user ${message.author.username}:${message.author.id} from server ${message.guild.name}:${message.guild.id}`
  )
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()

  const command =
    commands.get(commandName) ||
    commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) {
    return
  }

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply("I can't execute that command inside DMs!")
  }

  if (command.args && !args.length) {
    if (command.usage) {
      return message.channel.send(`
        You didn't provide any arguments, ${message.author}!
        The proper usage would be: \`${prefix}${command.name} ${command.usage}
      `)
    }

    return message.channel.send(
      `You didn't provide any arguments, ${message.author}!`
    )
  }

  try {
    // TODO: As we add more gateways we will want to figure out a better way to pass these in
    const result = command.execute(message, args, chronicleGateway(rest))
    handleResult(message)(result)
  } catch (error) {
    message.reply(
      `There was an error trying to execute that command! - ${error}`
    )
  }
})

client.login(process.env.DISCORD_TOKEN)
