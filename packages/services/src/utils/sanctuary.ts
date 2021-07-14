import { FutureInstance, reject, resolve } from 'fluture';
import { env as flutureEnv } from 'fluture-sanctuary-types';
import sanctuary from 'sanctuary';

// sanctuary does not support mjs format yet
const { create, env } = sanctuary;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Either<A, B> {
  '@@type': 'sanctuary/Either';
}

export interface Static {
  '@@type': 'sanctuary';
}

// TODO: There is an issue with the sanctuary types that does not allow me to export this properly.
export const S = create({ checkTypes: true, env: env.concat(flutureEnv) }) as any;

export const eitherToFuture = <L, R>(e: Either<L, R>): FutureInstance<L, R> =>
  // @ts-expect-error - issue with resolve and unknown
  S.either<any, FutureInstance<L, R>>(reject)(resolve)(e);
