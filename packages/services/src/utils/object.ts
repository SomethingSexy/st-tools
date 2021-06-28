import { pick as lPick, pickBy } from 'lodash-es';
import { isJust } from './primitive.js';

export const pickJust = <T>(d: T) => pickBy(d, isJust);

export const pick =
  (keys: string[]) =>
  <T>(d: T) =>
    lPick(d, keys);
