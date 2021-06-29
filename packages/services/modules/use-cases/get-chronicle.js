// This will need to be able to retrieve a chronicle by an external id or internal id
import { chain, reject } from 'fluture';
export const getChronicle = ({ chronicleGateway  })=>({ id , type  })=>chronicleGateway.exists({
            id,
            type
        }).pipe(chain((exists)=>{
            if (!exists) {
                return reject(`Chronicle with id ${id} does not exists.`);
            }
            return chronicleGateway.getChronicle({
                id,
                type
            });
        }))
;
