import type { Chronicle, CreateChronicleEntity } from '../../entity/chronicle'
import type { Either } from '../../utils/sanctuary'
import type { FutureInstance } from 'fluture'

/**
 * Creates a chronicle in the database and returns the id of the newly created chronicle
 */
export type CreateChronicle = (
  c: Either<string, CreateChronicleEntity>
) => FutureInstance<string, Chronicle>

export type ChronicleExistsByReference = (
  t: 'discord'
) => (id: string) => FutureInstance<string, boolean>

export type GetChronicle = (id: string) => FutureInstance<string, Chronicle>

export interface ChronicleGateway {
  create: CreateChronicle
  existsByReference: ChronicleExistsByReference
  getChronicle: GetChronicle
}
