import {
  type ChronicleGateway,
  type CreateChronicle,
  type GetChronicle,
} from '../types'
import { type Chronicle } from '../../../entity/chronicle'
import { type Rest } from '../../../service/rest/types'

/**
 * This represents the raw format of the chronicle when selected from the table directly
//  */
// interface RetrievedChronicle {
//   name: string;
//   id: string;
//   referenceId: string;
//   referenceType: 'discord';
//   game: 'vtm';
//   version: 'v5';
//   created_at: string;
//   updated_at: string;
// }

/**
 * Creates a new chronicle
 * @param db
 */
export const createChronicle =
  (options: Rest): CreateChronicle =>
  (c) =>
    c.asyncAndThen<Chronicle, string>(
      options.post('http://services:5101/chronicles')
    )

export const getChronicle = (options: Rest): GetChronicle =>
  options.get<Chronicle>(`http://services:5101/chronicles`)

/**
 * Complete gateway for accessing chronicle data
 * @param db
 */
export const chronicleGateway = (options: Rest): ChronicleGateway => ({
  create: createChronicle(options),
  getChronicle: getChronicle(options),
})
