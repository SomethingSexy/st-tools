import { FutureInstance, chain, map } from 'fluture';
import type { Knex } from 'knex';
import { Either, eitherToFuture } from '../utils/sanctuary.js';

export type Create = <Insert, InsertReturn, R>(
  insertAndReturn: (db: Knex) => (c: Insert) => FutureInstance<string, InsertReturn[]>
) => (
  mapInsertToFinal: (d: InsertReturn[]) => R
) => (db: Knex) => (d: Either<string, Insert>) => FutureInstance<string, R>;

export type Update = <Update, UpdateReturn, R>(
  updateAndReturn: (db: Knex) => (c: Update) => FutureInstance<string, UpdateReturn[]>
) => (
  mapUpdateToFinal: (d: UpdateReturn[]) => R
) => (db: Knex) => (d: Either<string, Update>) => FutureInstance<string, R>;

/**
 * Common create function for inserting and returning data.
 *
 * @param insertAndReturn
 * @returns
 */
export const create: Create = (insertAndReturn) => (mapInsertToFinal) => (db) => (d) =>
  eitherToFuture(d)
    .pipe(chain(insertAndReturn(db)))
    .pipe(map(mapInsertToFinal));

export const update: Update = (updateAndReturn) => (mapUpdateToFinal) => (db) => (d) =>
  eitherToFuture(d)
    .pipe(chain(updateAndReturn(db)))
    .pipe(map(mapUpdateToFinal));
