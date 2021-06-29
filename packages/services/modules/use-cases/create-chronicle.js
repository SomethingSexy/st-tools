import { chain, reject } from 'fluture';
import { createChronicleEntity } from '../entities/chronicle.js';
export const createChronicle = ({ chronicleGateway  })=>({ name , referenceId , referenceType , game , version  })=>chronicleGateway.existsByReference({
            id: referenceId,
            type: referenceType
        }).pipe(chain((exists)=>{
            if (exists) {
                return reject(`Chronicle with ${referenceId} already exists.`);
            }
            return chronicleGateway.create(createChronicleEntity({
                name,
                referenceId,
                referenceType,
                game,
                version
            }));
        }))
;
