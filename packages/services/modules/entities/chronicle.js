import Hapi from 'joi';
import { S } from '../utils/sanctuary.js';
export const Validation = Hapi.object({
    name: Hapi.string().required(),
    referenceId: Hapi.alternatives(Hapi.string(), Hapi.number()).required(),
    referenceType: Hapi.string().valid('discord').required(),
    game: Hapi.string().valid('vtm').required(),
    version: Hapi.string().valid('v5').required()
});
export const makeCreateChronicleEntity = (schema)=>(c)=>{
        const { error , value  } = schema.validate(c);
        return error ? S.Left(error.message) : S.Right(value);
    }
;
export const createChronicleEntity = makeCreateChronicleEntity(Validation);
