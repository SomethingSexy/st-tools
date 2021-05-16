import { chain, reject } from 'fluture';
import { createChronicleEntity } from '../entities/chronicle.js';
export const createChronicle = (gateway)=>({ name , referenceId , referenceType , game , version  })=>gateway.existsByReference({
            id: referenceId,
            type: referenceType
        }).pipe(chain((exists)=>{
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
        }))
;
