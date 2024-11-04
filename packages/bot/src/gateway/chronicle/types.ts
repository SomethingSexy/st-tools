import {
  type Chronicle,
  type CreateChronicleEntity,
} from '../../entity/chronicle.js'
import { type Result, type ResultAsync } from 'neverthrow'

/**
 * Creates a chronicle in the database and returns the id of the newly created chronicle
 */
export type CreateChronicle = (
  c: Result<CreateChronicleEntity, string>
) => ResultAsync<Chronicle, string>

export type ChronicleExistsByReference = (
  t: 'discord'
) => (id: string) => ResultAsync<boolean, string>

export type GetChronicle = (id: string) => ResultAsync<Chronicle, string>

export interface ChronicleGateway {
  create: CreateChronicle
  // existsByReference: ChronicleExistsByReference
  getChronicle: GetChronicle
}
