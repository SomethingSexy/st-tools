import { type ChronicleGateway, type CreateChronicle } from '../types'
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

/**
 * Complete gateway for accessing chronicle data from a postgres database
 * @param db
 */
export const chronicleGateway = (options: Rest): ChronicleGateway => {
  return {
    create: createChronicle(options),
    // @ts-expect-error - fix later, this type will change now
    getChronicle: () => {},
  }
}
