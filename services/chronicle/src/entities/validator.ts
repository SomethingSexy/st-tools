import Joi, { Schema } from '@hapi/joi';

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
