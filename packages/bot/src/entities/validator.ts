import { Schema } from 'joi'

export const validator = (schema: Schema) => (payload: object) => {
  const { error } = schema.validate(payload)
  if (error) {
    const message = error.details.map((el) => el.message).join('\n')
    return {
      error: message,
    }
  }
  return true
}
