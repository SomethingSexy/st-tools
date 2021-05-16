// This will need to be able to retrieve a chronicle by an external id or internal id
import { chain, reject } from 'fluture';
// TODO: This needs to check if the chronicle exists first
export const getChronicle = (gateway)=>(id)=>gateway.existsById({
            id
        }).pipe(chain((exists)=>{
            if (exists) {
                return reject(`Chronicle with id ${id} does not exists.`);
            }
            return gateway.getChronicleById(id);
        }))
;
