// This will need to be able to retrieve a chronicle by an external id or internal id
import { chain, reject } from 'fluture';
export const getCharacters = ({ chronicleGateway , characterGateway  })=>({ chronicleId  })=>chronicleGateway.exists({
            id: chronicleId
        }).pipe(chain((exists)=>{
            if (!exists) {
                return reject(`Chronicle with id ${chronicleId} does not exists.`);
            }
            return characterGateway.getCharacters({
                chronicleId
            });
        }))
;
