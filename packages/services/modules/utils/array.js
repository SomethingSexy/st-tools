export const atLeastOne = (x)=>Array.isArray(x) && x.length > 0
;
export const head = (x)=>atLeastOne(x) ? x[0] : null
;
export const mapAll = (f)=>(x)=>x.map(f)
;
