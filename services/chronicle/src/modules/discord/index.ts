import Discord from 'discord.js';
import fs from 'fs';
import { isString } from '../../utils/string';
import { ICommand } from './types';

const prefix = '!';

// Initialize Discord Bot
const client = new Discord.Client();
const commands = new Discord.Collection<string, ICommand>();

const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
  const command = require(`${__dirname}/commands/${file}`).default;
  commands.set(command.name, command);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
  console.log(
    `Accepting command ${message.content} from user ${message.author.username}:${message.author.id} from server ${message.guild.name}:${message.guild.id}`
  );
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = commands.get(commandName) || commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) {
    return;
  }

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  try {
    // TODO: Pass in gateways here
    const result = command.execute(message, args);
    if (isString(result)) {
      message.reply(result);
    } else {
      message.channel.send(result);
    }
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(process.env.DISCORD_TOKEN);
