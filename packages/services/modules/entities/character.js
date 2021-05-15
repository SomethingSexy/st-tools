import hapi from 'joi';
import S from 'sanctuary';
const { object , string  } = hapi;
// This is only what is required to create, we will probably want another validation
// for locking a character in?
export const Validation = object({
    name: string().required(),
    concept: string(),
    ambition: string(),
    desire: string(),
    splat: string().valid('vampire', 'human').required()
});
export const makeCreateCharacterEntity = (schema)=>(c)=>{
        const { error , value  } = schema.validate(c);
        return error ? S.Left(error.message) : S.Right(value);
    }
;
/**
 * Creates a Character entity.  A character is any player or non-player character in the game.
 */ export const createCharacterEntity = makeCreateCharacterEntity(Validation);
