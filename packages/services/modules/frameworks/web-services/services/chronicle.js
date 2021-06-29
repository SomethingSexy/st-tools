import { createChronicle } from '../../../use-cases/create-chronicle.js';
import { getChronicle } from '../../../use-cases/get-chronicle.js';
import { getChronicles } from '../../../use-cases/get-chronicles.js';
import { handleResult } from '../utils/response.js';
import { getCharacters } from '../../../use-cases/get-characters.js';
import { createCharacter } from '../../../use-cases/create-character.js';
const post = (gateway)=>({
        method: 'POST',
        url: '/chronicles',
        handler: (request, reply)=>{
            const body = request.body;
            handleResult(reply)(createChronicle(gateway)(body));
        }
    })
;
const get = (gateway)=>({
        method: 'GET',
        url: '/chronicles/:id',
        handler: (request, reply)=>{
            const { id  } = request.params;
            handleResult(reply)(getChronicle(gateway)({
                id
            }));
        }
    })
;
const getByReference = (gateway)=>({
        method: 'GET',
        url: '/chronicles/:id/:type',
        handler: (request, reply)=>{
            const { id , type  } = request.params;
            handleResult(reply)(getChronicle(gateway)({
                id,
                type
            }));
        }
    })
;
const getAll = (gateway)=>({
        method: 'GET',
        url: '/chronicles',
        handler: (request, reply)=>{
            handleResult(reply)(getChronicles(gateway)());
        }
    })
;
const getAllCharacters = (gateway)=>({
        method: 'GET',
        url: '/chronicles/:id/characters',
        handler: (request, reply)=>{
            const { id  } = request.params;
            handleResult(reply)(getCharacters(gateway)({
                chronicleId: id
            }));
        }
    })
;
// Create a character tied to a chronicle
const createChronicleCharacter = (gateway)=>({
        method: 'POST',
        url: '/chronicles/:id/characters',
        handler: (request, reply)=>{
            const body = request.body;
            const { id  } = request.params;
            handleResult(reply)(createCharacter(gateway)({
                ...body,
                chronicleId: id
            }));
        }
    })
;
export const services = [
    post,
    get,
    getAll,
    getByReference,
    getAllCharacters,
    createChronicleCharacter
];
