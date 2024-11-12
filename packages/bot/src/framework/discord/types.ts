import {
  type EmbedBuilder,
  type Interaction,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'
import { type Gateways } from '../../gateway/index.js'
import { type ResultAsync } from 'neverthrow'

export type ExecuteResult = string | { embeds: EmbedBuilder[] }

export type CommandResult = ResultAsync<ExecuteResult, ExecuteResult>

export interface ICommand {
  command:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
  execute: (message: Interaction, gateway: Gateways) => CommandResult
  autocomplete?: (
    message: Interaction,
    gateway: Gateways
  ) => ResultAsync<Array<{ name: string; value: string }>, string>
}
