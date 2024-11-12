import {
  type EmbedBuilder,
  type Interaction,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'
import { type Gateways } from '../../gateway/index.js'
import { type ResultAsync } from 'neverthrow'

export type Result = string | { embeds: EmbedBuilder[] }

export type CommandResult = ResultAsync<Result, Result>

export interface ICommand {
  command:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
  execute: (message: Interaction, gateway: Gateways) => CommandResult
  autocomplete?: (
    message: Interaction,
    gateway: Gateways
  ) => Array<{ name: string; value: string }>
}
