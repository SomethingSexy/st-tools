import { CreateChronicleEntity } from '../../entities/chronicle';
import { Either } from '../../utils/sanctuary';
import { FutureInstance } from 'fluture';

/**
 * Creates a chronicle in the database and returns the id of the newly created chronicle
 */
export type CreateChronicle = (c: Either<any, CreateChronicleEntity>) => FutureInstance<any, CreateChronicleEntity>;

export type ChronicleExistsByReference = (t: 'discord') => (id: string) => FutureInstance<any, boolean>;

export interface ChronicleGateway {
  create: CreateChronicle;
  existsByReference: ChronicleExistsByReference
}
