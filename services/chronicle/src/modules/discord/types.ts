import { Message } from 'discord.js';

export interface ICommand {
  aliases?: string[];
  args?: boolean;
  description: string;
  execute: (message: Message, args: string[]) => string | string[] | { embed: object };
  guildOnly?: boolean;
  name: string;
  usage?: string;
}
