import { chain } from 'fluture';
import { updateCharacterEntity } from '../entities/character.js';
// We could expect for the caller to fetch the chronicle by id, referenceId & referenceType,
export const updateCharacter = ({ characterGateway  })=>(data)=>characterGateway.getCharacterById(data.id).pipe(chain((character)=>{
            return characterGateway.update(updateCharacterEntity(data));
        }))
;
