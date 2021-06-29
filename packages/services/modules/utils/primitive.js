export const isNothing = (x)=>typeof x === 'undefined' || x === null
;
export const isJust = (x)=>!isNothing(x)
;
