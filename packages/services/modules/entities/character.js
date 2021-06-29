import Hapi from 'joi';
import S from 'sanctuary';
// This is only what is required to create, we will probably want another validation
// for locking a character in?
export const Validation = Hapi.object({
    referenceId: Hapi.string(),
    // TODO: I am not actually sure this should be required...
    referenceType: Hapi.string().required(),
    name: Hapi.string().required(),
    concept: Hapi.string(),
    ambition: Hapi.string(),
    desire: Hapi.string(),
    splat: Hapi.string().valid('vampire', 'human').required(),
    // For now this is required but this might not be later
    chronicleId: Hapi.string().required()
});
export const makeCreateCharacterEntity = (schema)=>(c)=>{
        const { error , value  } = schema.validate(c);
        return error ? S.Left(error.message) : S.Right(value);
    }
;
/**
 * Creates a Character entity.  A character is any player or non-player character in the game.
 */ export const createCharacterEntity = makeCreateCharacterEntity(Validation);
export const UpdateValidation = Hapi.object({
    id: Hapi.string().required(),
    // If name is being changed it needs to have some value
    name: Hapi.string().min(1),
    concept: Hapi.string(),
    ambition: Hapi.string(),
    desire: Hapi.string(),
    // if splat is being changed, it needs to have some value
    // TODO: maybe it doesn't make sense to allow this to be changed
    splat: Hapi.string().valid('vampire', 'human').min(1)
});
// TODO: We could probably combine this function and makeCreateCharacterEntity
export const makeUpdateCharacterEntity = (schema)=>(c)=>{
        const { error , value  } = schema.validate(c);
        return error ? S.Left(error.message) : S.Right(value);
    }
;
export const updateCharacterEntity = makeUpdateCharacterEntity(UpdateValidation);
