import { Message } from 'discord.js';

export interface ICommand {
  aliases?: string[];
  args?: boolean;
  description: string;
  // TODO: Figure out types on gateway or how best to pass this is in
  execute: (message: Message, args: string[], gateway: any) => string | string[] | { embed: object };
  guildOnly?: boolean;
  name: string;
  usage?: string;
}
