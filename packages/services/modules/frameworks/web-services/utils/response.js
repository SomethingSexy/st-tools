import { fork } from 'fluture';
export const handleResult = (reply)=>(result)=>{
        fork((e)=>reply.status(400).send(e)
        )((r)=>reply.status(200).send(r)
        )(result);
    }
;
