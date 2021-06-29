import { pick as lPick, pickBy } from 'lodash-es';
import { isJust } from './primitive.js';
export const pickJust = (d)=>pickBy(d, isJust)
;
export const pick = (keys)=>(d)=>lPick(d, keys)
;
