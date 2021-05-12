import type { Message } from 'discord.js';
import type { FutureInstance } from 'fluture';

export type Result = string | string[] | { embed: object };

export type CommandResult = FutureInstance<Result, Result>;

export interface ICommand {
  aliases?: string[];
  args?: boolean;
  description: string;
  // TODO: Figure out types on gateway or how best to pass this is in
  execute: (message: Message, args: string[], gateway: any) => CommandResult;
  guildOnly?: boolean;
  name: string;
  title: string;
  usage?: string;
}
