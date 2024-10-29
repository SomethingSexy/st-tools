import { type Message } from 'discord.js'
import { type ResultAsync } from 'neverthrow'

export type Result = string | string[] | { embed: object }

export type CommandResult = ResultAsync<Result, Result>

export interface ICommand {
  aliases?: string[]
  args?: boolean
  description: string
  // TODO: Figure out types on gateway or how best to pass this is in
  execute: (message: Message, args: string[], gateway: unknown) => CommandResult
  guildOnly?: boolean
  name: string
  title: string
  usage?: string
}
