import { ObjectSchema, Schema } from 'joi';
import { Either, S } from '../utils/sanctuary.js';

const validator = (schema: Schema) => (payload: any) => {
  const { error } = schema.validate(payload);
  if (error) {
    const message = error.details.map((el) => el.message).join('\n');
    return {
      error: message
    };
  }
  return true;
};

export const makeEntity =
  (schema: ObjectSchema) =>
  <Entity>(entity: Entity): Either<string, Entity> => {
    const { error, value } = schema.validate(entity);
    return error ? S.Left(error.message) : S.Right(value);
  };

export const makeUpdateEntity =
  (schema: ObjectSchema) =>
  <Entity>(entity: Entity): Either<string, Entity> => {
    const { error, value } = schema.validate(entity);
    return error ? S.Left(error.message) : S.Right(value);
  };
