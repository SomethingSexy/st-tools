import { fork } from 'fluture';
import { createChronicle } from "../../../use-cases/create-chronicle.js";
const handleResult = (reply)=>(result)=>{
        fork((e)=>reply.status(400).send(e)
        )((r)=>reply.status(200).send(r)
        )(result);
    }
;
const post = (gateway)=>({
        method: 'POST',
        url: '/chronicles',
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string'
                        },
                        referenceId: {
                            type: 'string'
                        },
                        referenceType: {
                            type: 'string'
                        },
                        game: {
                            type: 'string'
                        },
                        version: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        handler: (request, reply)=>{
            const body = request.body;
            handleResult(reply)(createChronicle(gateway)(body));
        }
    })
;
const get = (gateway)=>({
        method: 'GET',
        url: '/chronicles',
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string'
                        },
                        referenceId: {
                            type: 'string'
                        },
                        referenceType: {
                            type: 'string'
                        },
                        game: {
                            type: 'string'
                        },
                        version: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        handler: (request, reply)=>{
            console.log('foo');
            reply.send('foo');
        }
    })
;
export const services = [
    post,
    get
];
