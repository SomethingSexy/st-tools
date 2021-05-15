import { reject, resolve } from 'fluture';
import { env as flutureEnv } from 'fluture-sanctuary-types';
import sanctuary from 'sanctuary';
// sanctuary does not support mjs format yet
const { create , env  } = sanctuary;
// TODO: There is an issue with the sanctuary types that does not allow me to export this properly.
export const S = create({
    checkTypes: true,
    env: env.concat(flutureEnv)
});
export const eitherToFuture = (e)=>// @ts-expect-error - issue with resolve and unknown
    S.either(reject)(resolve)(e)
;
