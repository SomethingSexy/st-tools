import { chain, reject } from 'fluture';
import { createChronicleEntity } from '../entities/chronicle.js';
export const createChronicle = (gateway)=>({ name , referenceId , referenceType , game , version  })=>{
        return gateway.existsByReference(referenceType)(referenceId).pipe(chain((exists)=>{
            if (exists) {
                return reject(`Chronicle with ${referenceId} already exists.`);
            }
            return gateway.create(createChronicleEntity({
                name,
                referenceId,
                referenceType,
                game,
                version
            }));
        }));
    }
;
