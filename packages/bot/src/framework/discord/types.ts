import {
  type EmbedBuilder,
  type Interaction,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
} from 'discord.js'
import { type ResultAsync } from 'neverthrow'

export type Result = string | { embeds: EmbedBuilder[] }

export type CommandResult = ResultAsync<Result, Result>

export interface ICommand {
  command: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
  // TODO: Figure out types on gateway or how best to pass this is in
  execute: (message: Interaction, gateway: unknown) => CommandResult
}
