import type { Chronicle, CreateChronicleEntity } from '../../entities/chronicle';
import type { Either } from '../../utils/sanctuary';
import type { FutureInstance } from 'fluture';
import { ReferenceTypes } from '../../entities/constants';

/**
 * Creates a chronicle in the database and returns the id of the newly created chronicle
 */
export type CreateChronicle = (c: Either<string, CreateChronicleEntity>) => FutureInstance<string, Chronicle>;

export type ChronicleExistsByReference = (d: { id: string; type: ReferenceTypes}) => FutureInstance<string, boolean>;

export type ChronicleExistsById = (d: { id: string }) => FutureInstance<string, boolean>;

export type ChronicleExists = (d: { id?: string; type?: ReferenceTypes}) => FutureInstance<string, boolean>;

export type GetChronicle = (d: { [key: string]: string }) => FutureInstance<string, Chronicle>;

export type ListAllChronicles = () => FutureInstance<string, Chronicle[]>;

export interface ChronicleGateway {
  create: CreateChronicle;
  exists: ChronicleExists;
  existsByReference: ChronicleExistsByReference;
  existsById: ChronicleExistsById;
  getChronicle: GetChronicle;
  getChronicleById: GetChronicle;
  list: ListAllChronicles;
}
