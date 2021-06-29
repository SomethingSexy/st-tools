import { createCharacter } from '../../../use-cases/create-character.js';
import { updateCharacter } from '../../../use-cases/update-character.js';
import { handleResult } from '../utils/response.js';
/**
 * Creates a new character, this should be a character that is
 * not tied to a chronicle.  Could be someone creating a generic NPC
 * or characters that could be used in multiple chronicles.
 *
 * @param gateway
 * @returns
 */ export const post = (gateway)=>({
        method: 'POST',
        url: '/characters',
        handler: (request, reply)=>{
            const body = request.body;
            handleResult(reply)(createCharacter(gateway)(body));
        }
    })
;
/**
 * Updates pieces of a character.  Excluded pieces will not be removed unless
 * they are set to null.
 *
 * @param gateway
 * @returns
 */ export const patch = (gateway)=>({
        method: 'PATCH',
        url: '/characters/:id',
        handler: (request, reply)=>{
            const { id  } = request.params;
            const body = request.body;
            handleResult(reply)(updateCharacter(gateway)({
                ...body,
                id
            }));
        }
    })
;
export const services = [
    post,
    patch
];
