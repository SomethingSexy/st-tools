import { chain } from 'fluture';
import type { Chronicle, CreateChronicleEntity } from '../../../entities/chronicle';
import { Rest } from '../../../services/rest/types';
import { eitherToFuture } from '../../../utils/sanctuary.js';
import type { ChronicleGateway, CreateChronicle } from '../types';

/**
 * This represents the raw format of the chronicle when selected from the table directly
 */
interface RetrievedChronicle {
  name: string;
  id: string;
  referenceId: string;
  referenceType: 'discord';
  game: 'vtm';
  version: 'v5';
  created_at: string;
  updated_at: string;
}

/**
 * Creates a new chronicle
 * @param db
 */
 export const createChronicle = (db: Rest): CreateChronicle => (c) =>
  eitherToFuture(c)
    .pipe(chain<string, CreateChronicleEntity, Chronicle>(db.post('http://services:5101/chronicles')))


/**
 * Complete gateway for accessing chronicle data from a postgres database
 * @param db
 */
export const chronicleGateway = (db: Rest): ChronicleGateway => {
  return {
    create: createChronicle(db),
    // @ts-expect-error
    getChronicle: () => {}
  };
};
