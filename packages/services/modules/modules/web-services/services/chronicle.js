import { fork } from 'fluture';
import { createChronicle } from '../../../use-cases/create-chronicle.js';
import { getChronicle } from '../../../use-cases/get-chronicle.js';
const handleResult = (reply)=>(result)=>{
        fork((e)=>reply.status(400).send(e)
        )((r)=>reply.status(200).send(r)
        )(result);
    }
;
const post = (gateway)=>({
        method: 'POST',
        url: '/chronicles',
        handler: (request, reply)=>{
            const body = request.body;
            handleResult(reply)(createChronicle(gateway)(body));
        }
    })
;
const get = (gateway)=>({
        method: 'GET',
        url: '/chronicles/:id',
        handler: (request, reply)=>{
            const { id  } = request.params;
            handleResult(reply)(getChronicle(gateway)(id));
        }
    })
;
export const services = [
    post,
    get
];
