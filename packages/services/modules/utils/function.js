export const compose = (fn1, ...fns)=>fns.reduceRight((prevFn, nextFn)=>(value)=>prevFn(nextFn(value))
    , fn1)
;
