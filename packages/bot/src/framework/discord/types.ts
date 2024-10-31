import { type Interaction, type SlashCommandBuilder } from 'discord.js'
import { type ResultAsync } from 'neverthrow'

export type Result = string | { embeds: [object] }

export type CommandResult = ResultAsync<Result, Result>

export interface ICommand {
  // aliases?: string[]
  // args?: boolean
  // description: string
  command: SlashCommandBuilder
  // TODO: Figure out types on gateway or how best to pass this is in
  execute: (message: Interaction, gateway: unknown) => CommandResult
  // guildOnly?: boolean
  // name: string
  // title: string
  // usage?: string
}
