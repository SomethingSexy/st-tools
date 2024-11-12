import { type Result, err, ok } from 'neverthrow'
import { type ValidateFunction } from 'ajv'

export type Validate = <T>(payload: T) => Result<T, string>

export const validate =
  (validatior: ValidateFunction): Validate =>
  (payload) => {
    const valid = validatior(payload)

    return !valid
      ? err(validatior.errors.map((e) => e.message).join())
      : ok(payload)
  }
