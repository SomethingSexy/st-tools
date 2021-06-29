import { chain, reject } from 'fluture';
import { createCharacterEntity } from '../entities/character.js';
export const createCharacter = ({ characterGateway , chronicleGateway  })=>({ name , chronicleId , splat , referenceType  })=>chronicleGateway.existsById({
            id: chronicleId
        }).pipe(chain((exists)=>{
            if (!exists) {
                return reject(`Chronicle with ${chronicleId} does not exist.`);
            }
            return characterGateway.create(createCharacterEntity({
                name,
                chronicleId,
                splat,
                referenceType
            }));
        }))
;
